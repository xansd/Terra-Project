import { PartnersType } from "../domain/partner-types.enum";

export interface IPartnerDTO {
  partner_id: string;
  access_code?: string | null;
  number: string;
  name: string;
  surname: string;
  email: string;
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
  therapeutic: number | boolean;
  user_created?: string | null;
  user_updated?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface IPartnerSubsetDTO {
  partner_id: string;
  number: string;
  access_code?: string | null;
  name: string;
  surname: string;
  dni: string;
}
