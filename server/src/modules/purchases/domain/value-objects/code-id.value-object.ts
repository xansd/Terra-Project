import { ValueObject } from "../../../shared/domain/value-objects/value-object";
import { createHash } from "crypto";
import { PurchaseID } from "./purchase-id.value.object";

export class PurchaseCode extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(purchase_id: PurchaseID, value?: string): PurchaseCode {
    if (value) {
      return new PurchaseCode(value);
    }
    return new PurchaseCode(
      PurchaseCode.generatePurchaseCode(purchase_id.value)
    );
  }

  private static generatePurchaseCode(purchase_id: string): string {
    const hash = createHash("sha-256").update(purchase_id).digest("hex");
    const alphanumeric = hash.replace(/\d/g, "").toUpperCase();
    const code = "C-" + alphanumeric.substring(0, 8);

    return code;
  }
}
