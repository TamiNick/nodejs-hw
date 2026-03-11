import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof HttpError) {
    statusCode = err.statusCode || err.status || 500;
    message = err.message || err.name;
  } else {
    message = err.message || err.name || "Unexpected error";
  }

  res.status(statusCode).json({ message });
};
