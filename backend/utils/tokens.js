import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT access token for a given user ID.
 * The token is signed with JWT_SECRET and expires per JWT_EXPIRE in .env
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '2h' }
  );
};
