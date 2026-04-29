import * as crypto from 'crypto';

export function generateOtp(): {
  otp: string;
  hash: string;
} {
  const otp = crypto.randomInt(100000, 999999).toString();

  const hash = crypto.createHash('sha256').update(otp).digest('hex');

  return { otp, hash };
}
