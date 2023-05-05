import { Email } from "./value-objects/email.value-object";

export class UserAlreadyExistsError extends Error {
  constructor(email: Email | string) {
    super(`El usuario ${email} ya existe`);
    this.name = "UserAlreadyExistsError";
  }
}

export class UserDoesNotExistError extends Error {
  constructor() {
    super(`El usuario no existe`);
    this.name = "UserDoesNotExistError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("El usuario o la contraseña son incorrectos");
    this.name = "InvalidCredentialsError";
  }
}

export class UserNotActive extends Error {
  constructor() {
    super("El usuario no está activo");
    this.name = "UserNotActive";
  }
}

export class UserHasToResetError extends Error {
  constructor() {
    super("El usuario debe resetear su contraseña");
    this.name = "UserHasToReset";
  }
}

export class UsersNotFoundError extends Error {
  constructor() {
    super(`No hay usuarios registrados`);
    this.name = "UsersNotFoundError";
  }
}

export class ResourceForbiddenError extends Error {
  constructor() {
    super(`No tienes permisos para acceder a este recurso`);
    this.name = "ResourceForbiddenError";
  }
}

export class PasswordHistoryError extends Error {
  constructor() {
    super(`La contraseña ya ha sido utilizada recientemente`);
    this.name = "PasswordHistoryError";
  }
}
