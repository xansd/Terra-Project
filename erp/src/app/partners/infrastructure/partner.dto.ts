import { FeesVariants, IFeesType } from '../domain/fees';
import { PartnersType } from '../domain/partner-type.enum';
import { ISanctions } from '../domain/sanctions';

export interface IPartnerDTO {
  partner_id?: string;
  access_code?: string;
  number?: string;
  name: string;
  surname: string;
  email: string;
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
  fee_expiration?: string;
  inscription?: FeesVariants;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
export interface IFeesDTO {
  fee_id?: number;
  partner_id?: string;
  fees_type_id: IFeesType;
  expiration: string;
  paid: number | boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
