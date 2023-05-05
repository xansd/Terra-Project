export class TokenInvalidError extends Error {
  constructor() {
    super('Token no encontrado o inválido');
    this.name = 'TokenInvalidError';
  }
}
