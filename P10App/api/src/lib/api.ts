import { Request, Response, NextFunction } from 'express';
import { supabase } from './supabase';

// Type definitions for API responses
type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// API Response Handler
export const apiResponse = <T>(
  res: Response,
  status: number,
  data?: T,
  message?: string,
  error?: string
): Response<ApiResponse<T>> => {
  return res.status(status).json({
    success: status >= 200 && status < 300,
    data,
    message,
    error,
  });
};

// Error Handler
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('API Error:', error);
  return apiResponse(res, 500, null, 'An unexpected error occurred', error.message);
};

// Authentication Middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return apiResponse(res, 401, null, 'No token provided', 'Unauthorized');
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return apiResponse(res, 401, null, 'Invalid or expired token', 'Unauthorized');
    }

    // Attach user to request object
    (req as any).user = user;
    next();
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    return apiResponse(res, 500, null, 'Authentication failed', errorMessage);
  }
};

// Role-based access control
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return apiResponse(res, 403, null, 'User not authenticated', 'Forbidden');
    }

    if (!roles.includes(user.role)) {
      return apiResponse(res, 403, null, 'Insufficient permissions', 'Forbidden');
    }

    next();
  };
};