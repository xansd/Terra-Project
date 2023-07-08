import { IProvider } from '../../providers/domain/providers';

export interface IHarvests {
  harvest_id?: string;
  code?: string;
  provider_id: string;
  product_id: string;
  provider_name?: string;
  product_name?: string;
  cost_price?: number;
  sale_price?: number;
  fee_amount?: number;
  quantity?: number;
  notes?: string;
  stock?: number;
  loss?: number;
  paid?: number;
  manicured?: number;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class Harvests implements IHarvests {
  harvest_id?: string;
  code?: string | undefined;
  provider_id: string;
  product_id: string;
  provider_name?: string;
  product_name?: string;
  cost_price?: number | undefined;
  sale_price?: number | undefined;
  fee_amount?: number | undefined;
  quantity?: number | undefined;
  notes?: string | undefined;
  stock?: number;
  loss?: number;
  manicured?: number;
  paid?: number;
  user_created?: string | undefined;
  user_updated?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  deleted_at?: string | undefined;

  private constructor(props: IHarvests) {
    this.harvest_id = props.harvest_id;
    this.code = props.code;
    this.provider_id = props.provider_id;
    this.product_id = props.product_id;
    this.product_name = props.product_name;
    this.provider_name = props.provider_name;
    this.cost_price = props.cost_price;
    this.sale_price = props.sale_price;
    this.fee_amount = props.fee_amount;
    this.quantity = props.quantity;
    this.notes = props.notes;
    this.stock = props.stock;
    this.manicured = props.manicured;
    this.loss = props.loss;
    this.paid = props.paid;
    this.user_created = props.user_created;
    this.user_updated = props.user_updated;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  }
  public static create(props: IHarvests) {
    return new Harvests(props);
  }
}
