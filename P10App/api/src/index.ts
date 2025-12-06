import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { createServer, Server } from 'http';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import picksRouter from './routes/picks.routes';

// Load environment variables
config();

class App {
  public app: Application;
  public server: Server;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.server = createServer(this.app);
    this.port = port;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }));

    // Request logging
    this.app.use(morgan('dev'));

    // JSON body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  private initializeRoutes(): void {
    // Picks API routes
    this.app.use('/picks', picksRouter);

    // Root welcome route
    this.app.get('/', (req: Request, res: Response) => {
      res.json({ message: 'Welcome to P10 API - F1 Prediction Game' });
    });
  }

  private initializeErrorHandling(): void {
    // Handle 404
    this.app.use(notFoundHandler);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      logger.info(`Server is running on port ${this.port}`);
    });
  }
}

// Start the server
const PORT = parseInt(process.env.PORT || '5000', 10);
const app = new App(PORT);
app.listen();

export default app;
