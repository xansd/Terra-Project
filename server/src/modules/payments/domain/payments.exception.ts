export class PaymentDoesNotExistError extends Error {
  constructor() {
    super(`El pago/cobro no existe`);
    this.name = "PaymentDoesNotExistError";
  }
}

export class PaymentNotFoundError extends Error {
  constructor() {
    super(`No hay pagos/cobros registrados`);
    this.name = "PaymentNotFoundError";
  }
}

export class PaymentCreationError extends Error {
  constructor() {
    super(`Ha ocurrido un error al crear el cobro/pago`);
    this.name = "PaymentCreationError";
  }
}

export class PaymentReferenceNotFoundError extends Error {
  constructor() {
    super(`No se ha encontrado un referencia válida`);
    this.name = "PaymentReferenceNotFoundError";
  }
}

export class PaymentLimitExceededError extends Error {
  constructor() {
    super(`El pago es superior al abono pendiente`);
    this.name = "PaymentLimitExceded";
  }
}
