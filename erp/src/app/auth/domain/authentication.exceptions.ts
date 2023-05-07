export class TokenInvalidError extends Error {
  constructor() {
    super('Token no encontrado o inválido');
    this.name = 'TokenInvalidError';
  }
}

export class InvalidCredentials extends Error {
  constructor() {
    super('Usuario o password inválidos');
    this.name = 'InvalidCredentials';
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

export class ResourceForbiddenError extends Error {
  constructor() {
    super(`No tienes permisos para acceder a este recurso`);
    this.name = 'ResourceForbiddenError';
  }
}

export class PasswordHistoryError extends Error {
  constructor() {
    super(`La contraseña ya ha sido utilizada recientemente`);
    this.name = 'PasswordHistoryError';
  }
}
