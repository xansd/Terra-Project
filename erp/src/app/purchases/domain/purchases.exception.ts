export class PurchaseDoesNotExistError extends Error {
  constructor() {
    super(`El cultivo/compra no existe`);
    this.name = "PurchaseDoesNotExistError";
  }
}

export class PurchaseNotFoundError extends Error {
  constructor() {
    super(`No hay cultivos/compras registrados`);
    this.name = "PurchaseNotFoundError";
  }
}

export class PurchaseDetailsEnrollError extends Error {
  constructor() {
    super(`Error al asignar los detalles a la compra`);
    this.name = "PurchaseDetailsEnrollError";
  }
}

export class HarvestDoesNotExistError extends Error {
  constructor() {
    super(`El cultivo/compra no existe`);
    this.name = "HarvestDoesNotExistError";
  }
}

export class HarvestNotFoundError extends Error {
  constructor() {
    super(`No hay cultivos/compras registrados`);
    this.name = "HarvestNotFoundError";
  }
}
