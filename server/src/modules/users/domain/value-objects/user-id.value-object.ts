import { v4 as uuidv4 } from "uuid";
import { ValueObject } from "../../../shared/domain/value-objects/value-object";

export class UserID extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(value?: string): UserID {
    if (value) {
      return new UserID(value);
    }
    return new UserID(uuidv4());
  }
}
