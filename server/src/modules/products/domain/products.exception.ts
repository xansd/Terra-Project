export class ProductDoesNotExistError extends Error {
  constructor() {
    super(`El producto no existe`);
    this.name = "ProductDoesNotExistError";
  }
}

export class ProductNotFoundError extends Error {
  constructor() {
    super(`No hay productos registrados`);
    this.name = "ProductNotFoundError";
  }
}

export class ProductAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`El producto ${name} ya existe`);
    this.name = "ProductAlreadyExistsError";
  }
}

export class SubCategoryEnrollError extends Error {
  constructor() {
    super(`Error al asignar subcategoría`);
    this.name = "SubCategoryEnrollError";
  }
}

export class AncestorEnrollError extends Error {
  constructor() {
    super(`Error al asignar ancestro`);
    this.name = "AncestorEnrollError";
  }
}

export class SubCategoryCreationError extends Error {
  constructor() {
    super(`Error al crear la subcategoría`);
    this.name = "SubCategoryCreationError";
  }
}

export class SubCategoryDoesNotExistError extends Error {
  constructor() {
    super(`La subcategoría no existe`);
    this.name = "SubCategoryDoesNotExistError";
  }
}

export class CategoriesNotFoundError extends Error {
  constructor() {
    super(`No se han encontrado categorías`);
    this.name = "CategoriesNotFoundError";
  }
}

export class SubcategoriesNotFoundError extends Error {
  constructor() {
    super(`No se han encontrado subcategorías`);
    this.name = "SubcategoriesNotFoundError";
  }
}

export class NoStockError extends Error {
  constructor() {
    super(`No hay stock`);
    this.name = "NoStockError";
  }
}
