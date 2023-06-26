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

export class TransactionCreationError extends Error {
  constructor() {
    super(`Ha ocurrido un errror al crear la transacción`);
    this.name = "TransactionCreationError";
  }
}
