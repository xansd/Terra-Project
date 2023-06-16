import { v4 as uuidv4 } from "uuid";
import { ValueObject } from "../../../shared/domain/value-objects/value-object";

export class SalesID extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(value?: string): SalesID {
    if (value) {
      return new SalesID(value);
    }
    return new SalesID(uuidv4());
  }
}
