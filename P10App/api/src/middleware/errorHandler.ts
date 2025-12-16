import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface ValidationError {
  [key: string]: {
    message: string;
    path: string;
    value: any;
  };
}

interface ExtendedError extends Error {
  statusCode?: number;
  errors?: ValidationError;
  code?: number | string;
}

export const errorHandler = (
  err: ExtendedError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default to 500 Internal Server Error if status code is not set
  const statusCode = err.statusCode || 500;
  
  // Log the error
  logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${err.message}`);
  
  // Base error response
  const errorResponse: {
    status: string;
    message: string;
    stack?: string;
    errors?: ValidationError;
  } = {
    status: 'error',
    message: statusCode === 500 ? 'Internal Server Error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    errorResponse.message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    errorResponse.message = 'Token expired';
  }

  // Handle validation errors
  if (err.name === 'ValidationError' && err.errors) {
    errorResponse.message = 'Validation Error';
    errorResponse.errors = err.errors;
  }

  res.status(statusCode).json(errorResponse);
};

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage:
// throw new AppError('Resource not found', 404);
// next(new AppError('You are not authorized to access this route', 401));
