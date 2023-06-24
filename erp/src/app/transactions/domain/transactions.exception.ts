export class TransactionDoesNotExistError extends Error {
  constructor() {
    super(`El ingreso/gasto no existe`);
    this.name = "TransactionDoesNotExistError";
  }
}

export class TransactionNotFoundError extends Error {
  constructor() {
    super(`No hay ingresos/gastos registrados`);
    this.name = "TransactionNotFoundError";
  }
}
