import { ValueObject } from "../../../shared/domain/value-objects/value-object";
import { createHash } from "crypto";
import { TransactionsID } from "./transactions-id.value.object";

export class TransactionsCode extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(
    Transactions_id: TransactionsID,
    value?: string
  ): TransactionsCode {
    if (value) {
      return new TransactionsCode(value);
    }
    return new TransactionsCode(
      TransactionsCode.generateTransactionsCode(Transactions_id.value)
    );
  }

  private static generateTransactionsCode(Transactions_id: string): string {
    const hash = createHash("sha-256").update(Transactions_id).digest("hex");
    const alphanumeric = hash.replace(/\d/g, "").toUpperCase();
    const code = "T-" + alphanumeric.substring(0, 8);

    return code;
  }
}
