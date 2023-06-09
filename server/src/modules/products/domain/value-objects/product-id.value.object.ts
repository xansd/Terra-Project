import { v4 as uuidv4 } from "uuid";
import { ValueObject } from "../../../shared/domain/value-objects/value-object";

export class ProductID extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(value?: string): ProductID {
    if (value) {
      return new ProductID(value);
    }
    return new ProductID(uuidv4());
  }
}
