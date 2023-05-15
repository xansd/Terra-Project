import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpValidationError } from "./http-error";

export interface IValidationError {
  [key: string]: {
    type: string;
    msg: string;
    path: string;
    location: string;
  };
}

export const catchValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Capturamos errores de validación si los hubiese
  const validationErrors = validationResult(req);
  // Si hay errores de validación los devolvemos
  if (!validationErrors.isEmpty()) {
    res.send(
      HttpValidationError(
        "http-validation-error",
        validationErrors.mapped() as IValidationError
      )
    );
    return;
  }
  next();
};
