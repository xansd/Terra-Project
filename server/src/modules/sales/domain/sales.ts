import { SalesCode } from "./value-objects/code-id.value-object";
import { SalesID } from "./value-objects/sales-id.value.object";

export interface ISalesDetails {
  sale_detail_id: string;
  sale_id: SalesID;
  product_id: string;
  quantity: number;
}

export interface ISales {
  sale_id: SalesID;
  code?: SalesCode;
  partner_id: string;
  discount?: number;
  tax?: number;
  total_amount: number;
  sale_details: ISalesDetails;
  notes?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class Sales implements ISales {
  sale_id: SalesID;
  code?: SalesCode | undefined;
  partner_id: string;
  discount?: number;
  tax?: number;
  total_amount: number;
  sale_details: ISalesDetails;
  notes?: string;
  user_created?: string | undefined;
  user_updated?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  deleted_at?: string | undefined;
  private constructor(props: ISales) {
    this.sale_id = props.sale_id;
    this.code = props.code;
    this.partner_id = props.partner_id;
    this.discount = props.discount;
    this.tax = props.tax;
    this.total_amount = props.total_amount;
    this.sale_details = props.sale_details;
    this.notes = props.notes;
    this.user_created = props.user_created;
    this.user_updated = props.user_updated;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  }

  public static create(props: ISales) {
    return new Sales(props);
  }
}
