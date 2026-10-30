import rateLimit from 'express-rate-limit';

// Rate limiter for authentication routes: prevents brute force attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 100, // higher limit in test mode
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true, // Return standard rate limit info in headers
  legacyHeaders: false
});
