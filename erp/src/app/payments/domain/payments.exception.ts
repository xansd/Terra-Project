export class PaymentDoesNotExistError extends Error {
  constructor() {
    super(`El pago/cobro no existe`);
    this.name = 'PaymentDoesNotExistError';
  }
}

export class PaymentNotFoundError extends Error {
  constructor() {
    super(`No hay pagos/cobros registrados`);
    this.name = 'PaymentNotFoundError';
  }
}

export class InvalidAmountError extends Error {
  constructor() {
    super(`Error de cálculo debido a valores incorrectos`);
    this.name = 'InvalidAmountError';
  }
}
