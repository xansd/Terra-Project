export class FeeNotFoundError extends Error {
  constructor() {
    super(`No se encuantra la cuota/inscripción`);
    this.name = "FeeNotFoundError";
  }
}
