import { Email } from "../../shared/domain/value-objects/email.value-object";
import { PartnersType } from "./partner-types.enum";
import { PartnerID } from "./value-objects/partner-id.value.object";
import { PartnerNumber } from "./value-objects/partner-number.value.object";

export interface IPartner {
  partner_id: PartnerID;
  access_code?: string;
  number: PartnerNumber;
  name: string;
  surname: string;
  email: Email;
  phone: string;
  address: string;
  dni?: string;
  birthday: string;
  registration: string;
  leaves?: string;
  cannabis_month: number;
  hash_month: number;
  extractions_month: number;
  others_month: number;
  partner_type_id: PartnersType;
  active: boolean;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class Partner implements IPartner {
  partner_id: PartnerID;
  access_code?: string;
  number: PartnerNumber;
  name: string;
  surname: string;
  email: Email;
  phone: string;
  address: string;
  dni?: string;
  birthday: string;
  registration: string;
  leaves?: string;
  cannabis_month: number;
  hash_month: number;
  extractions_month: number;
  others_month: number;
  partner_type_id: PartnersType;
  active: boolean;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  constructor(props: IPartner) {
    this.partner_id = props.partner_id ? props.partner_id : PartnerID.create();
    this.access_code = props.access_code;
    this.number = props.number ? props.number : PartnerNumber.create();
    this.name = props.name;
    this.surname = props.surname;
    this.email = props.email;
    this.phone = props.phone;
    this.address = props.address;
    this.dni = props.dni;
    this.birthday = props.birthday;
    this.registration = props.registration;
    this.leaves = props.leaves;
    this.cannabis_month = props.cannabis_month;
    this.hash_month = props.hash_month;
    this.extractions_month = props.extractions_month;
    this.others_month = props.others_month;
    this.partner_type_id = props.partner_type_id;
    this.active = props.active;
    this.user_created = props.user_created;
    this.user_updated = props.user_updated;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  }

  public static create(props: IPartner): Partner {
    return new Partner(props);
  }
}
