import { v4 as uuidv4 } from "uuid";
import { ValueObject } from "../../../shared/domain/value-objects/value-object";

export class PurchaseID extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(value?: string): PurchaseID {
    if (value) {
      return new PurchaseID(value);
    }
    return new PurchaseID(uuidv4());
  }
}
