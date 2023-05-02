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

export class UsersNotFoundError extends Error {
  constructor() {
    super(`No hay usuarios registrados`);
    this.name = "UsersNotFoundError";
  }
}
