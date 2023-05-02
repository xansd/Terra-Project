import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "process";
import { NotFound, Unauthorized, HttpError } from "./http-error";
import { HttpErrorDTO, toDTO } from "./http-error-dto";
import { UnauthorizedError } from "express-jwt";
import { isNil } from "../../../../shared/type-checkers";

export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  next(NotFound(`Cannot ${req.method} ${req.path}`));
}

export function unautorizedHandler(
  error: Error,
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (error instanceof UnauthorizedError) {
    next(Unauthorized(error.message));
  } else {
    next(error);
  }
}

export function errorStatusHandler(
  error: HttpError,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);

  next(error);
}

export function errorHandler(
  error: HttpError,
  _req: Request,
  res: Response<HttpErrorDTO>,
  _next: NextFunction
): void {
  if (!isNil(error.stack) && env.isProduction) {
    delete error.stack;
  }

  res.send(toDTO(error));
}
