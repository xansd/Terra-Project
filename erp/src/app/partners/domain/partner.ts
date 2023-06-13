import { Email } from 'src/app/shared/domain/value-objects/email.value-object';
import { PartnersType } from './partner-type.enum';
import { FeesVariants, IFees, IFeesType } from './fees';
import { ISanctions } from './sanctions';
export interface IPartner {
  partner_id?: string;
  access_code?: string;
  number?: string;
  name: string;
  surname: string;
  email: Email;
  phone: string;
  address: string;
  dni?: string;
  birthday: string;
  leaves?: string;
  cannabis_month: number;
  hash_month: number;
  extractions_month: number;
  others_month: number;
  partner_type_id: PartnersType;
  active: boolean | number;
  therapeutic: boolean | number;
  sanctions?: ISanctions[];
  fee?: FeesVariants;
  inscription?: FeesVariants;
  cash: number;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum DocumentTypes {
  ALTA = 'alta',
  CULTIVO = 'cultivo',
  RECIBO_ALTA = 'recibo_alta',
  RECIBO_CUOTA = 'recibo_cuota',
}

export interface IPartnersType {
  partner_type_id: number;
  name: string;
}

export class Partner implements IPartner {
  partner_id?: string;
  access_code?: string;
  number?: string;
  name: string;
  surname: string;
  email: Email;
  phone: string;
  address: string;
  dni?: string;
  birthday: string;
  leaves?: string;
  cannabis_month: number;
  hash_month: number;
  extractions_month: number;
  others_month: number;
  partner_type_id: PartnersType;
  active: boolean | number;
  therapeutic: boolean | number;
  sanctions?: ISanctions[];
  fee?: FeesVariants;
  inscription?: FeesVariants;
  cash: number;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  private constructor(props: IPartner) {
    this.partner_id = props.partner_id ? props.partner_id : '';
    this.access_code = props.access_code ? props.access_code : '';
    this.number = props.number ? props.number : '';
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
    this.therapeutic = props.therapeutic;
    this.sanctions = props.sanctions;
    this.fee = props.fee;
    this.inscription = props.inscription;
    this.cash = props.cash;
    this.user_created = props.user_created ? props.user_created : '';
    this.user_updated = props.user_updated ? props.user_updated : '';
    this.created_at = props.created_at ? props.created_at : '';
    this.updated_at = props.updated_at ? props.updated_at : '';
    this.deleted_at = props.deleted_at ? props.deleted_at : '';
  }

  static create(props: IPartner): Partner {
    return new Partner(props);
  }
}
