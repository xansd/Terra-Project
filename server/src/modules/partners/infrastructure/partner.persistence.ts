import { FeesVariants } from "../../fees/domain/fees";
import { ISanctions } from "../domain/partner";

export interface IPartnerPersistence {
  partner_id: string;
  access_code?: string | null;
  number: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  dni?: string | null;
  birth_date: string;
  leaves?: string | null;
  cannabis_month: number;
  hash_month: number;
  extractions_month: number;
  others_month: number;
  partner_type_id: number;
  active: number;
  therapeutic: number;
  fee?: FeesVariants;
  fee_expiration?: string | null;
  inscription?: FeesVariants;
  sanctions: ISanctions[];
  cash: number;
  debt_limit?: number;
  user_created?: string | null;
  user_updated?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface IPartnerPersistenceSubset {
  partner_id: string;
  number: number;
  access_code?: string | null;
  name: string;
  surname: string;
  dni: string;
}
