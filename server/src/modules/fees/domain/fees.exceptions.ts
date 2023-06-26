export class FeeNotFoundError extends Error {
  constructor() {
    super(`No se encuantra la cuota/inscripción`);
    this.name = "FeeNotFoundError";
  }
}

export class NotANumberError extends Error {
  constructor() {
    super(`Error en el cálculo del pago de la cuota`);
    this.name = "NotANumberError";
  }
}
