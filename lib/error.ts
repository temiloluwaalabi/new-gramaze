export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(errors: Record<string, string[]>) {
    super("Validation failed", 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super("Unauthorized", 401);
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super("Forbidden", 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}
