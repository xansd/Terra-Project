import { Email } from "../../shared/domain/value-objects/email.value-object";
import config from "../../../config/app-config";

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

export class PartnerInsufficientBalance extends Error {
  constructor() {
    super(`No hay saldo suficiente en la cuenta del socio`);
    this.name = "PartnerInsufficientBalance";
  }
}

export class Number20Limit extends Error {
  constructor() {
    super(`No se puede sobrepasar el n20`);
    this.name = "Number20Limit";
  }
}

export class MaxDebtLimitError extends Error {
  constructor() {
    super(`Se ha sobrepasado el limite de deuda de ${config.DEB_LIMIT_STRING}`);
    this.name = "MaxDebtLimitError";
  }
}

export class MaxRefundLimitError extends Error {
  constructor() {
    super(`Limite de reintegro sobrepasado. No hay saldo suficiente.`);
    this.name = "MaxRefundLimitError";
  }
}

export class InvalidAmountError extends Error {
  constructor() {
    super(`Valores para el cálculo no válidos`);
    this.name = "InvalidAmountError";
  }
}

export class MinZeroError extends Error {
  constructor() {
    super(`No se permiten valores negativos en esta operación`);
    this.name = "MaxRefundLimitError";
  }
}

export class SanctionErrorCreate extends Error {
  constructor() {
    super(`Ha ocurrido un error al crear la sanción`);
    this.name = "MaxRefundLimitError";
  }
}

export class SanctionDoesNotExists extends Error {
  constructor() {
    super(`La sanción a eliminar no existe`);
    this.name = "SanctionDoesNotExists";
  }
}
