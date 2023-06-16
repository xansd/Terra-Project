import { v4 as uuidv4 } from "uuid";
import { ValueObject } from "../../../shared/domain/value-objects/value-object";

export class TransactionsID extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(value?: string): TransactionsID {
    if (value) {
      return new TransactionsID(value);
    }
    return new TransactionsID(uuidv4());
  }
}
