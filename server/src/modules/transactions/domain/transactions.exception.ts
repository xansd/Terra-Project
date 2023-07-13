export class TransactionDoesNotExistError extends Error {
  constructor() {
    super(`El ingreso/gasto no existe`);
    this.name = "TransactionDoesNotExistError";
  }
}

export class AccountDoesNotExistError extends Error {
  constructor() {
    super(`La cuenta no existe`);
    this.name = "AccountDoesNotExistError";
  }
}

export class TransactionNotFoundError extends Error {
  constructor() {
    super(`No hay ingresos/gastos registrados`);
    this.name = "TransactionNotFoundError";
  }
}

export class AccountNotFoundError extends Error {
  constructor() {
    super(`No hay cuentas registradas`);
    this.name = "AccountNotFoundError";
  }
}

export class AccountInsufficientBalance extends Error {
  constructor() {
    super(`No hay saldo suficiente en la cuenta de la Asociación`);
    this.name = "AccountInsufficientBalance";
  }
}

export class TransactionCreationError extends Error {
  constructor() {
    super(`Ha ocurrido un errror al crear la transacción`);
    this.name = "TransactionCreationError";
  }
}
