export class FieldValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FieldValidationError';
  }
}
