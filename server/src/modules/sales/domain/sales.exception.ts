export class SaleDoesNotExistError extends Error {
  constructor() {
    super(`La retirada/venta no existe`);
    this.name = "SaleDoesNotExistError";
  }
}

export class SaleNotFoundError extends Error {
  constructor() {
    super(`No hay retiradas/ventas registradas`);
    this.name = "SaleNotFoundError";
  }
}
