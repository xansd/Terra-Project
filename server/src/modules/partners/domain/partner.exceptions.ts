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
