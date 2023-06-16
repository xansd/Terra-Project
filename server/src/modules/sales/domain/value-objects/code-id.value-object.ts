import { ValueObject } from "../../../shared/domain/value-objects/value-object";
import { createHash } from "crypto";
import { SalesID } from "./sales-id.value.object";

export class SalesCode extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(Sales_id: SalesID, value?: string): SalesCode {
    if (value) {
      return new SalesCode(value);
    }
    return new SalesCode(SalesCode.generateSalesCode(Sales_id.value));
  }

  private static generateSalesCode(Sales_id: string): string {
    const hash = createHash("sha-256").update(Sales_id).digest("hex");
    const alphanumeric = hash.replace(/\d/g, "").toUpperCase();
    const code = "V-" + alphanumeric.substring(0, 8);

    return code;
  }
}
