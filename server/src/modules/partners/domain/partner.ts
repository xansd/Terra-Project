import { FeesVariants } from "../../fees/domain/fees";
import { Email } from "../../shared/domain/value-objects/email.value-object";
import { PartnersType } from "./partner-types.enum";
import { PartnerID } from "./value-objects/partner-id.value.object";

export interface ISanctions {
  sanction_id: number;
  partner_id: string;
  severity: number;
  sanction_date: string;
  description: string;
  created_at: string;
}

export interface IPartner {
  partner_id: PartnerID;
  access_code?: string | null;
  number: string;
  name: string;
  surname: string;
  email: Email;
  phone: string;
  address: string;
  dni?: string | null;
  birthday: string;
  leaves?: string | null;
  cannabis_month: number;
  hash_month: number;
  extractions_month: number;
  others_month: number;
  partner_type_id: PartnersType;
  active: boolean | number;
  therapeutic: boolean | number;
  fee?: FeesVariants;
  inscription?: FeesVariants;
  sanctions: ISanctions[];
  cash: number;
  user_created?: string | null;
  user_updated?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface IPartnersType {
  partner_type_id: number;
  name: string;
}

export class Partner implements IPartner {
  partner_id: PartnerID;
  access_code?: string | null;
  number: string;
  name: string;
  surname: string;
  email: Email;
  phone: string;
  address: string;
  dni?: string | null;
  birthday: string;
  leaves?: string | null;
  cannabis_month: number;
  hash_month: number;
  extractions_month: number;
  others_month: number;
  partner_type_id: PartnersType;
  active: boolean | number;
  therapeutic: boolean | number;
  fee?: FeesVariants;
  inscription?: FeesVariants;
  sanctions: ISanctions[];
  cash: number;
  user_created?: string | null;
  user_updated?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;

  private constructor(props: IPartner) {
    this.partner_id = props.partner_id ? props.partner_id : PartnerID.create();
    this.access_code = props.access_code;
    this.number = props.number;
    this.name = props.name;
    this.surname = props.surname;
    this.email = props.email;
    this.phone = props.phone;
    this.address = props.address;
    this.dni = props.dni;
    this.birthday = props.birthday;
    this.leaves = props.leaves;
    this.cannabis_month = props.cannabis_month;
    this.hash_month = props.hash_month;
    this.extractions_month = props.extractions_month;
    this.others_month = props.others_month;
    this.partner_type_id = props.partner_type_id;
    this.active = props.active;
    this.fee = props.fee;
    this.inscription = props.inscription;
    this.sanctions = props.sanctions;
    this.therapeutic = props.therapeutic;
    this.cash = props.cash;
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
