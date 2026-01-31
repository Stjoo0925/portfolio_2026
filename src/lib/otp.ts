import { generateSync, verifySync, generateURI } from 'otplib';

// OTP_SECRET은 Base32 인코딩된 문자열이어야 함 (Google Authenticator 호환)
const secret = process.env.OTP_SECRET as string;

export function generateOTP() {
  return generateSync({ secret });
}

export function verifyOTP(token: string) {
  try {
    return verifySync({ token, secret });
  } catch (error) {
    console.error('OTP verification error:', error);
    return false;
  }
}

/**
 * Google Authenticator 등 OTP 앱에서 스캔할 수 있는 URL을 생성합니다.
 */
export function getOtpAuthURL(userEmail: string = 'admin@portfolio.com') {
  return generateURI({
    issuer: 'Portfolio Admin',
    label: userEmail,
    secret
  });
}
