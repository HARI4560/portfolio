import crypto from 'crypto';

/**
 * Generate a cryptographically secure random token
 * @param {number} bytes - Number of random bytes (default 32 → 64 hex chars)
 * @returns {string} Hex-encoded token string
 */
const generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

export { generateToken };
