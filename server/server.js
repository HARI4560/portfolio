import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
// Prevent NoSQL injection
app.use(mongoSanitize());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://harish-k.netlify.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
}));

// Prevent HTTP Parameter Pollution
app.use(hpp());
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many login attempts, please try again later.' },
});

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: { message: 'Too many requests from this IP, please try again later.' },
});

// Apply global limiter to all API routes except auth which has its own
app.use('/api', globalLimiter);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large (max 10MB)' });
    }
    return res.status(400).json({ message: err.message });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
