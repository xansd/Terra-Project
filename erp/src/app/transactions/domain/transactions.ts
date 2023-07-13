export enum TransactionCategoryType {
  GASTO = 'GASTO',
  INGRESO = 'INGRESO',
  TRANSFERENCIA = 'TRANSFERENCIA',
}

export interface ITransactionType {
  transaction_type_id: string;
  name: string;
  description?: string;
  transaction_category: TransactionCategoryType;
}

export interface ITransactions {
  transaction_id?: string;
  code?: string;
  transaction_type_id: string;
  transaction_type_name?: string;
  transaction_category?: string | null;
  amount: number;
  recurrence_days?: number | null;
  recurrence_times?: number | null;
  date_start?: string | null;
  interest?: number | null;
  notes?: string | null;
  source_account_id?: string | null;
  destination_account_id?: string | null;
  partner_id?: string | null;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum TransactionsTypes {
  INGRESO_CUOTA = 1,
  INGRESO_INSCRIPCION = 2,
  INGRESO_CUENTA_SOCIO = 3,
  INGRESOS_DONACIONES = 4,
  INGRESOS_PRESTAMOS = 5,
  GASTOS_ALQUILER = 6,
  GASTOS_SERVICIOS = 7,
  GASTOS_ACTIVIDADES_ASOCIACION = 8,
  GASTOS_PRESTAMOS = 9,
  REINTEGRO_CUENTA_SOCIO = 10,
  REINTEGRO_CUOTA = 11,
  REINTEGRO_INSCRIPCION = 12,
  INGRESO_CUENTA_BANCARIA = 13, // TRANSFERENCIA
  REINTEGRO_CUENTA_BANCARIA = 14, // TRANSFERENCIA
}

export class Transactions implements ITransactions {
  transaction_id?: string;
  code?: string;
  transaction_type_id: string;
  transaction_type_name?: string;
  transaction_category?: string | null;
  amount: number;
  recurrence_days?: number | null;
  recurrence_times?: number | null;
  date_start?: string | null;
  interest?: number | null;
  notes?: string | null;
  source_account_id?: string | null;
  destination_account_id?: string | null;
  partner_id?: string | null;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  private constructor(props: ITransactions) {
    this.transaction_id = props.transaction_id;
    this.code = props.code;
    this.transaction_type_id = props.transaction_type_id;
    this.transaction_type_name = props.transaction_type_name;
    this.transaction_category = props.transaction_category;
    this.amount = props.amount;
    this.recurrence_days = props.recurrence_days;
    this.recurrence_times = props.recurrence_times;
    this.date_start = props.date_start;
    this.interest = props.interest;
    this.notes = props.notes;
    this.source_account_id = props.source_account_id;
    this.destination_account_id = props.destination_account_id;
    this.partner_id = props.partner_id;
    this.user_created = props.user_created;
    this.user_updated = props.user_updated;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  }

  public static create(props: ITransactions) {
    return new Transactions(props);
  }
}
