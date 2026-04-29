import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const token = req.cookies?.access_token;

    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }

    return req;
  }
}
