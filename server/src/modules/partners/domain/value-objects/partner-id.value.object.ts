import { v4 as uuidv4 } from "uuid";
import { ValueObject } from "../../../shared/domain/value-objects/value-object";

export class PartnerID extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(value?: string): PartnerID {
    if (value) {
      return new PartnerID(value);
    }
    return new PartnerID(uuidv4());
  }
}
