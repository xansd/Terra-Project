export enum PaymentType {
  PAGO = "PAGO",
  COBRO = "COBRO",
  // TRANSFERENCIA_SALIENTE = "TRANSFERENCIA_SALIENTE",
  // TRANSFERENCIA_ENTRANTE = "TRANSFERENCIA_ENTRANTE",
}

export enum AccountType {
  CAJA = "CAJA",
  BANCO = "BANCO",
}

export interface IAccount {
  account_id?: string;
  name?: string;
  description: string | null;
  account_type?: AccountType;
  account_number: string | null;
  bank?: string | null;
  balance?: number | 0;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IPayments {
  payment_id?: string;
  type: PaymentType;
  reference_id: string;
  amount?: number;
  notes?: string | null;
  source_account_id?: string | null;
  source_account_name?: string | null;
  account_id?: number | string | null;
  account_name?: string | null;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class Payments implements IPayments {
  payment_id?: string;
  type: PaymentType;
  reference_id: string;
  amount?: number | undefined;
  notes?: string | null;
  source_account_id?: string | null;
  source_account_name?: string | null;
  account_id?: number | string | null;
  account_name?: string | null;
  user_created?: string | undefined;
  user_updated?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  deleted_at?: string | undefined;

  private constructor(props: IPayments) {
    this.payment_id = props.payment_id;
    this.type = props.type;
    this.reference_id = props.reference_id;
    this.amount = props.amount;
    this.notes = props.notes;
    this.source_account_id = props.source_account_id;
    this.source_account_name = props.source_account_name;
    this.account_id = props.account_id;
    this.account_name = props.account_name;
    this.user_created = props.user_created;
    this.user_updated = props.user_updated;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  }

  public static create(props: IPayments) {
    return new Payments(props);
  }
}
