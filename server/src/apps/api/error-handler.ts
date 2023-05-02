import { Response } from "express";
import { DomainValidationError } from "../../modules/shared/domain/domain-validation.exception";

export const errorHandler = (error: unknown, response: Response): void => {
  console.error(error);
  if (error instanceof DomainValidationError) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
  response.status(500).json({
    success: false,
    message: "Internal server error",
    code: 500,
  });
};
