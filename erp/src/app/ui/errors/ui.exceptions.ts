export class ModalError extends Error {
  constructor() {
    super('Ha ocurrido un error al manejar los datos del diálogo');
    this.name = 'ModalError';
  }
}
