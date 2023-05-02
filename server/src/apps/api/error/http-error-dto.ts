import { HttpError } from "./http-error";

export interface HttpErrorDTO {
  error: {
    status: string;
    status_code: number;
    message: string;
    stack?: string;
  };
}

export function toDTO(error: HttpError): HttpErrorDTO {
  return {
    error: {
      status: error.status,
      status_code: error.statusCode,
      message: error.message,
      stack: error.stack,
    },
  };
}
