import { ProductsType } from "../../products/domain/products";
import { Email } from "../../shared/domain/value-objects/email.value-object";
import { ProviderID } from "./value-objects/provider-id.value.object";

export interface IProvider {
  provider_id: ProviderID;
  name?: string;
  email?: Email;
  phone?: string;
  address?: string;
  type: ProductsType;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class Provider implements IProvider {
  provider_id: ProviderID;
  name?: string | undefined;
  email?: Email | undefined;
  phone?: string | undefined;
  address?: string | undefined;
  type: ProductsType;
  user_created?: string | undefined;
  user_updated?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  deleted_at?: string | undefined;

  private constructor(props: IProvider) {
    this.provider_id = props.provider_id;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.address = props.address;
    this.type = props.type;
    this.user_created = props.user_created;
    this.user_updated = props.user_updated;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  }

  public static create(props: IProvider): Provider {
    return new Provider(props);
  }
}
