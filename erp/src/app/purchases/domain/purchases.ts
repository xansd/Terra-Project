export interface IPurchaseDetails {
  purchase_detail_id?: string;
  purchase_id?: string;
  product_id: string;
  quantity: number;
  amount: number;
}

export interface IPurchase {
  purchase_id: string;
  code?: string;
  provider_id: string;
  total_amount?: number;
  purchase_details: IPurchaseDetails[];
  notes?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class Purchase implements IPurchase {
  purchase_id: string;
  code?: string | undefined;
  provider_id: string;
  total_amount?: number | undefined;
  purchase_details: IPurchaseDetails[];
  notes?: string | undefined;
  user_created?: string | undefined;
  user_updated?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  deleted_at?: string | undefined;

  private constructor(props: IPurchase) {
    this.purchase_id = props.purchase_id;
    this.code = props.code;
    this.provider_id = props.provider_id;
    this.total_amount = props.total_amount;
    this.purchase_details = props.purchase_details;
    this.notes = props.notes;
    this.user_created = props.user_created;
    this.user_updated = props.user_updated;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  }

  public static create(props: IPurchase) {
    return new Purchase(props);
  }
}
