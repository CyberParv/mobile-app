import jwt from 'jsonwebtoken';

export const generateAccessToken = (user: { id: string; email: string }) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: { id: string; email: string }) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
