import { v4 as uuidv4 } from "uuid";
import { ValueObject } from "../../../shared/domain/value-objects/value-object";

export class ProviderID extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(value?: string): ProviderID {
    if (value) {
      return new ProviderID(value);
    }
    return new ProviderID(uuidv4());
  }
}
