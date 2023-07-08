export class ProviderDoesNotExistError extends Error {
  constructor() {
    super(`El proveedor/cultivador no existe`);
    this.name = "ProviderDoesNotExistError";
  }
}

export class ProvidersNotFoundError extends Error {
  constructor() {
    super(`No hay proveedores/cultivadores registrados`);
    this.name = "ProvidersNotFoundError";
  }
}

export class ProviderAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`El proveedor/cultivador ${name} ya existe`);
    this.name = "ProviderAlreadyExistsError";
  }
}
