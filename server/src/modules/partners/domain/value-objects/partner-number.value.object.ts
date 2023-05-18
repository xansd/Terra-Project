import { ValueObject } from "../../../shared/domain/value-objects/value-object";

export class PartnerNumber extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(value?: string): PartnerNumber {
    if (value) {
      return new PartnerNumber(value);
    }
    return new PartnerNumber(PartnerNumber.addNewNumber());
  }

  private static addNewNumber(): string {
    let lastNumber = 21;
    let newNumber = lastNumber++;

    return newNumber.toString();
  }
}

// getLastNumber from bbdd
// if last-number is between 1 & 20 inclusive, number is 21
// if last-number is > 20, number is last-number++;
