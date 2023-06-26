export class SaleDoesNotExistError extends Error {
  constructor() {
    super(`La retirada/venta no existe`);
    this.name = "SaleDoesNotExistError";
  }
}

export class SaleNotFoundError extends Error {
  constructor() {
    super(`No hay retiradas registradas`);
    this.name = "SaleNotFoundError";
  }
}
export class SaleDetailsEnrollError extends Error {
  constructor() {
    super(`Error al asignar los detalles a la compra`);
    this.name = "SaleDetailsEnrollError";
  }
}
