import { ProductCode } from "./value-objects/code-id.value-object";
import { ProductID } from "./value-objects/product-id.value.object";

export enum ProductsType {
  MANCOMUNADOS = "mancomunados",
  TERCEROS = "terceros",
}

export interface ICategories {
  category_id: string;
  name: string;
  type: ProductsType;
}

export interface ISubcategories {
  subcategory_id: string;
  name: string;
  category_id: string;
}

export interface IProduct {
  product_id?: ProductID;
  code?: ProductCode;
  name: string;
  type: ProductsType;
  category_id: string;
  subcategories: string[];
  description?: string;
  cost_price?: number;
  sale_price?: number;
  ancestors?: string[];
  sativa?: number;
  indica?: number;
  thc?: number;
  cbd?: number;
  bank?: string;
  flawour?: string;
  effect?: string;
  stock?: number;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class Product implements IProduct {
  product_id?: ProductID;
  code?: ProductCode;
  name: string;
  type: ProductsType;
  category_id: string;
  subcategories: string[];
  description?: string | undefined;
  cost_price?: number | undefined;
  sale_price?: number | undefined;
  ancestors?: string[];
  sativa?: number | undefined;
  indica?: number | undefined;
  thc?: number | undefined;
  cbd?: number | undefined;
  bank?: string | undefined;
  flawour?: string | undefined;
  effect?: string | undefined;
  stock?: number;
  user_created?: string | undefined;
  user_updated?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  deleted_at?: string | undefined;

  private constructor(props: IProduct) {
    this.product_id = props.product_id;
    this.code = props.code;
    this.name = props.name;
    this.type = props.type;
    this.category_id = props.category_id;
    this.subcategories = props.subcategories;
    this.description = props.description;
    this.cost_price = props.cost_price;
    this.sale_price = props.sale_price;
    this.ancestors = props.ancestors;
    this.sativa = props.sativa;
    this.indica = props.indica;
    this.thc = props.thc;
    this.cbd = props.cbd;
    this.bank = props.bank;
    this.flawour = props.flawour;
    this.effect = props.effect;
    this.stock = props.stock;
    this.user_created = props.user_created;
    this.user_updated = props.user_updated;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  }

  public static create(props: IProduct) {
    return new Product(props);
  }
}
