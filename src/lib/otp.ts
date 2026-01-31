import { generateSync, verifySync } from 'otplib';

const secret = process.env.OTP_SECRET || 'fallback-secret-for-dev';

export function generateOTP() {
  return generateSync({ secret });
}

export function verifyOTP(token: string) {
  const result = verifySync({ token, secret });
  return result.valid;
}
