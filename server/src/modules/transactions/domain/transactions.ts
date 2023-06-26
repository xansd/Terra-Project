import { TransactionsCode } from "./value-objects/code-id.value-object";
import { TransactionsID } from "./value-objects/transactions-id.value.object";

export enum TransactionCategoryType {
  GASTO = "GASTO",
  INGRESO = "INGRESO",
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
}

export interface ITransactionType {
  transaction_type_id: string;
  name: string;
  description?: string;
  transaction_category: TransactionCategoryType;
}

// Si recurrence_times = -1 significa que es recurrente indefinido
export interface ITransactions {
  transaction_id?: TransactionsID;
  code?: TransactionsCode;
  transaction_type_id: string;
  amount: number;
  recurrence_days?: number;
  recurrence_times?: number;
  date_start?: string;
  interest?: number;
  notes?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class Transactions implements ITransactions {
  transaction_id?: TransactionsID;
  code?: TransactionsCode | undefined;
  transaction_type_id: string;
  amount: number;
  recurrence_days?: number | undefined;
  recurrence_times?: number | undefined;
  date_start?: string | undefined;
  interest?: number | undefined;
  notes?: string | undefined;
  user_created?: string | undefined;
  user_updated?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  deleted_at?: string | undefined;

  private constructor(props: ITransactions) {
    this.transaction_id = props.transaction_id;
    this.code = props.code;
    this.transaction_type_id = props.transaction_type_id;
    this.amount = props.amount;
    this.recurrence_days = props.recurrence_days;
    this.recurrence_times = props.recurrence_times;
    this.date_start = props.date_start;
    this.interest = props.interest;
    this.notes = props.notes;
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
