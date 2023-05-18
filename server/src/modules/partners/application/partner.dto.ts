import { PartnersType } from "../domain/partner-types.enum";

export interface IPartnerDTO {
  partner_id: string;
  access_code?: string;
  number: string;
  name: string;
  surname: string;
  email: string;
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
