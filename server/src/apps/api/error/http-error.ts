import StatusCodes from "http-status-codes";
import Logger from "../../../modules/shared/infraestructure/logger";

export interface HttpError {
  status: string;
  statusCode: number;
  message: string;
  stack?: string;
}

export function NotFound(message: string): HttpError {
  Logger.error(`http-error : NotFound : ${message}`);
  return {
    status: "Not Found",
    statusCode: StatusCodes.NOT_FOUND,
    message,
  };
}

export function BadRequest(message: string): HttpError {
  Logger.error(`http-error : BadRequest : ${message}`);
  return {
    status: "Bad Request",
    statusCode: StatusCodes.BAD_REQUEST,
    message,
  };
}

export function Conflict(message: string): HttpError {
  Logger.error(`http-error : Conflict : ${message}`);
  return {
    status: "Conflict",
    statusCode: StatusCodes.CONFLICT,
    message,
  };
}

export function Unauthorized(message: string): HttpError {
  Logger.error(`http-error : Unauthorized : ${message}`);
  return {
    status: "Unauthorized",
    statusCode: StatusCodes.UNAUTHORIZED,
    message,
  };
}

export function Forbidden(message: string): HttpError {
  Logger.error(`http-error : Forbidden : ${message}`);
  return {
    status: "Forbidden",
    statusCode: StatusCodes.FORBIDDEN,
    message,
  };
}

export function InternalServerError(error: unknown): HttpError {
  Logger.error(`http-error : InternalServerError : ${error}`);
  const httpError: HttpError = {
    status: "Internal Server Error",
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "Something went wrong",
  };

  if (error instanceof Error) {
    httpError.stack = error.stack;
  }

  return httpError;
}
