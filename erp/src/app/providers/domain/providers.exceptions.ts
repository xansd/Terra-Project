export class ProviderDoesNotExistError extends Error {
  constructor() {
    super(`El proveedor no existe`);
    this.name = "ProviderDoesNotExistError";
  }
}

export class ProvidersNotFoundError extends Error {
  constructor() {
    super(`No hay proveedores registrados`);
    this.name = "ProvidersNotFoundError";
  }
}

export class ProviderAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`El proveedor ${name} ya existe`);
    this.name = "ProviderAlreadyExistsError";
  }
}
