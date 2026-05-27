import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environmental variables
dotenv.config();

// Establish database connection pool
connectDB();

const app = express();

// CORS must come BEFORE helmet so preflight OPTIONS requests are not blocked
const corsOptions = {
  origin: (origin, callback) => {
    // Allow any localhost port in development (handles Vite port switching)
    const allowedInDev = !origin || /^http:\/\/localhost:\d+$/.test(origin);
    const allowedProd = origin === process.env.FRONTEND_URL;
    if (allowedInDev || allowedProd) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes

// Security Hardening Middlewares (after CORS)
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter: Max 100 requests per 15 mins for global routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests originating from this IP, please try again in 15 minutes.'
  }
});
app.use('/api', limiter);

// Root entry API route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Velrovix Premium Cinematic Luxury API - Operational',
    version: '1.0.0',
    timestamp: new Date()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Error boundary hooks
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n\x1b[36m==================================================`);
  console.log(`[Server] Velrovix active in ${process.env.NODE_ENV} mode`);
  console.log(`[Server] API Live: http://localhost:${PORT}`);
  console.log(`==================================================\x1b[0m\n`);
});
