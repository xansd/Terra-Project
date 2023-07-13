export class FeeNotFoundError extends Error {
  constructor() {
    super(`No se encuentra la cuota/inscripción`);
    this.name = "FeeNotFoundError";
  }
}

export class NotANumberError extends Error {
  constructor() {
    super(`Error en el cálculo del pago de la cuota`);
    this.name = "NotANumberError";
  }
}

export class FeePaymentError extends Error {
  constructor() {
    super(`Error durante el pago de la cuota.`);
    this.name = "FeePaymentError";
  }
}
export class DeleteFeeTransactionError extends Error {
  constructor() {
    super(`Error al eliminar la transacción de tipo cuota.`);
    this.name = "FeePaymentError";
  }
}
