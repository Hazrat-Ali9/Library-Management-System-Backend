import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === 'ValidationError') {
    const formattedErrors: Record<string, any> = {};

    for (const field in error.errors) {
      const err = error.errors[field];

      formattedErrors[field] = {
        message: err.message,
        name: err.name,
        properties: {
          message: err.properties?.message,
          type: err.properties?.type,
          min: err.properties?.min
        },
        kind: err.kind,
        path: err.path,
        value: err.value
      };
    }

    return res.status(400).json({
      message: 'Validation failed',
      success: false,
      error: {
        name: 'ValidationError',
        errors: formattedErrors
      }
    });
  }

  return res.status(500).json({
    message: 'Something went wrong',
    success: false,
    error: error.message || 'Internal Server Error'
  });
};
