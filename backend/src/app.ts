import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import dotenv from 'dotenv';
import { z } from 'zod';
import { AppError } from './utils/errors';
import authRoutes from './routes/auth.routes';
import foodRoutes from './routes/food.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import cartRoutes from './routes/cart.routes';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cart', cartRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Centralized Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error Handler]:', err);
  let status = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: {
        message: 'Validation Error',
        details: err.issues.map(issue => ({
          path: issue.path,
          message: issue.message
        })),
        status: 400,
        timestamp: new Date().toISOString()
      }
    });
  }

  if (err instanceof AppError) {
    status = err.statusCode;
  }

  res.status(status).json({
    error: {
      message,
      status,
      timestamp: new Date().toISOString()
    }
  });
});

export default app;
