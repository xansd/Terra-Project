import StatusCodes from "http-status-codes";
import Logger from "../../utils/logger";
import { IValidationError } from "./validate-fileds";

export interface HttpError {
  status: string;
  statusCode: number;
  message: string;
  stack?: string;
  validationData?: IValidationError;
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

export function HttpValidationError(
  message: string,
  validationData: IValidationError
): HttpError {
  Logger.error(`http-error : HttpValidationError : ${message}`);
  return {
    status: "Http Validation Error",
    statusCode: StatusCodes.BAD_REQUEST,
    message,
    validationData,
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

export function HasToReset(message: string): HttpError {
  Logger.error(`http-error : HasToReset : ${message}`);
  return {
    status: "Unauthorized",
    statusCode: 499,
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

export function _MulterError(message: string): HttpError {
  Logger.error(`multer-error : error al subir el archivo`);
  return {
    status: "Multer error",
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message,
  };
}

export function InternalServerError(error: unknown): HttpError {
  Logger.error(`http-error : InternalServerError : ${error}`);
  const httpError: HttpError = {
    status: "Internal Server Error",
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "Error interno del servidor",
  };

  if (error instanceof Error) {
    httpError.stack = error.stack;
  }

  return httpError;
}
