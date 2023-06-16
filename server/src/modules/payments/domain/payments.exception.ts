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
