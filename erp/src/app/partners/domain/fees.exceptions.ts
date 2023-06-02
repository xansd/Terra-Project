export class InvalidFeeType extends Error {
  constructor() {
    super(`Tipo de cuota inválido`);
    this.name = 'InvalidFeeType';
  }
}
