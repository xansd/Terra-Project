import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiResponse, IValidationError } from "../../interfaces";

export const catchValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Capturamos errores de validación si los hubiese
  const validationErrors = validationResult(req);
  // Si hay errores de validación los devolvemos
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "validation errors",
      data: validationErrors.mapped() as IValidationError,
    }) as unknown as ApiResponse<IValidationError>;
  }

  next();
};
