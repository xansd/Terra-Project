import { Email } from "../../shared/domain/value-objects/email.value-object";

export class PartnerDoesNotExistError extends Error {
  constructor() {
    super(`El socio no existe`);
    this.name = "PartnerDoesNotExistError";
  }
}

export class PartnersNotFoundError extends Error {
  constructor() {
    super(`No hay socios registrados`);
    this.name = "PartnersNotFoundError";
  }
}

export class PartnerAlreadyExistsError extends Error {
  constructor(email: Email | string) {
    super(`El usuario ${email} ya existe`);
    this.name = "UserAlreadyExistsError";
  }
}

export class Number20Limit extends Error {
  constructor() {
    super(`No se puede sobrepasar el n20`);
    this.name = "Number20Limit";
  }
}
