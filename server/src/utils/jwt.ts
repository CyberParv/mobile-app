import jwt from 'jsonwebtoken';

export const signAccessToken = (userId: string) => {
  return jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });
};

export const signRefreshToken = (userId: string) => {
  return jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};