import { ValueObject } from "../../../shared/domain/value-objects/value-object";
import { createHash } from "crypto";
import { ProductID } from "./product-id.value.object";

export class ProductCode extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(product_id: ProductID, value?: string): ProductCode {
    if (value) {
      return new ProductCode(value);
    }
    return new ProductCode(ProductCode.generateProductCode(product_id.value));
  }

  private static generateProductCode(productId: string): string {
    const hash = createHash("sha-256").update(productId).digest("hex");
    const alphanumeric = hash.replace(/\d/g, "").toUpperCase();
    const code = "P-" + alphanumeric.substring(0, 8);

    return code;
  }
}
