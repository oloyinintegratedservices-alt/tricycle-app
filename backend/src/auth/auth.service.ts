import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from './constants';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { generateOtp } from './helpers/generate-otp';
import { EmailService } from '../email/email.service';
import { url } from 'inspector';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private emailService: EmailService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) throw new BadRequestException('Incorrect credentials');

    const valid = await argon2.verify(user.password, dto.password);
    if (!valid) throw new BadRequestException('Incorrect credentials');

    const roles = user.userRoles.map((ur) => ur.role.name);

    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.name),
        ),
      ),
    ];

    const { accessToken } = await this.signTokens(
      user.id,
      user.email as string,
      roles,
      permissions,
    );

    return {
      user: {
        fullname: user.fullname,
        email: user.email,
        roles,
        permissions,
      },
      accessToken,
    };
  }

  async verifyEmail(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.emailVerified) {
      throw new BadRequestException('Invalid verification attempt');
    }

    if (!user.emailOtpHash || !user.emailOtpExpiresAt) {
      throw new BadRequestException('No OTP found');
    }

    if (user.emailOtpExpiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    if (otpHash !== user.emailOtpHash) {
      throw new BadRequestException('Invalid OTP');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailOtpHash: null,
        emailOtpExpiresAt: null,
      },
    });

    const { password: _, ...safeUser } = updatedUser;

    return { user: safeUser };
  }

  async resendEmailOtp(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.emailVerified) return;

    const { otp, hash } = generateOtp();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailOtpHash: hash,
        emailOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpiresAt: new Date(),
      },
    });

    const resetLink = `${this.config.get(
      'FRONTEND_URL',
    )}/reset-password?token=${hashedToken}`;

    console.log(resetLink);

    await this.emailService.sendMail({
      to: user.email!,
      subject: 'Reset Password',
      template: 'reset-password',
      context: { url: resetLink },
    });

    return {
      message: 'success',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await argon2.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
    });
  }

  async signTokens(
    userId: string,
    email: string,
    roles: string[],
    permissions: string[],
  ) {
    const payload = { userId, email, roles, permissions };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: jwtConstants.secret,
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return this.signTokens(
        decoded.sub,
        decoded.email,
        decoded.roles,
        decoded.permissions,
      );
    } catch (e) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
