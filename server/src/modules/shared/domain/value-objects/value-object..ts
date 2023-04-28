export abstract class ValueObject<T> {
  public readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  /**
   * Compara si dos ValueObject son iguales
   * @param {ValueObject<T>} vo
   * @returns {boolean}
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.value === undefined) {
      return false;
    }

    return this.value === vo.value;
  }
}
