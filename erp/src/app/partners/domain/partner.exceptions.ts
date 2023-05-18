export class PartnerNotActive extends Error {
  constructor() {
    super('El socio no está activo');
    this.name = 'PartnerNotActive';
  }
}

export class PartnersNotFoundError extends Error {
  constructor() {
    super(`No hay socios registrados`);
    this.name = 'UsersNotFoundError';
  }
}
