export class InvalidCredentialsError extends Error {
  constructor() {
    super('El usuario o la contraseña son incorrectos');
    this.name = 'InvalidCredentialsError';
  }
}

export class UserNotActive extends Error {
  constructor() {
    super('El usuario no está activo');
    this.name = 'UserNotActive';
  }
}

export class UserHasToResetError extends Error {
  constructor() {
    super('El usuario debe resetear su contraseña');
    this.name = 'UserHasToReset';
  }
}

export class UsersNotFoundError extends Error {
  constructor() {
    super(`No hay usuarios registrados`);
    this.name = 'UsersNotFoundError';
  }
}
