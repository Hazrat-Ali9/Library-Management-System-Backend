import express, { Application, NextFunction, Request, Response } from 'express';
import { bookRoutes } from './app/controllers/book.controller';
import { borrowRoutes } from './app/controllers/borrow.controller';
import { errorHandler } from './app/utils/errorHandler';
import cors from 'cors';

const app: Application = express();

app.use(cors());

app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);


// app.use(errorHandler);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

app.use('/', (req, res) => {
  res.send("Welcome to Library Management API with Express, TypeScript & MongoDB!");
})

export default app;
