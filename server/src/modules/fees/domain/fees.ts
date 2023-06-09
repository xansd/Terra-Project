export enum FeesVariants {
  CUOTA_20 = 1,
  CUOTA_EXENTA = 2,
  INSCRIPCION_EXENTA = 3,
  INSCRIPCION_20 = 4,
  INSCRIPCION_10 = 5,
}

export enum FeesTypes {
  FEES = "fees",
  INSCRIPTION = "inscription",
}

export interface IFees {
  fee_id?: number;
  partner_id?: string;
  fees_type_id: FeesVariants;
  expiration?: string | null;
  paid?: number | boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IFeesType {
  fees_type_id: number;
  name: string;
  description: string;
  type: FeesTypes;
}

export class Fees implements IFees {
  fee_id?: number;
  partner_id?: string;
  fees_type_id: FeesVariants;
  expiration?: string | null;
  paid?: number | boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  private constructor(props: IFees) {
    this.fee_id = props.fee_id;
    this.partner_id = props.partner_id;
    this.fees_type_id = props.fees_type_id;
    this.expiration = props.expiration;
    this.paid = props.paid;
    this.created_at = props.created_at ? props.created_at : undefined;
    this.updated_at = props.updated_at ? props.updated_at : undefined;
    this.deleted_at = props.deleted_at ? props.deleted_at : undefined;
  }

  public static create(props: IFees): Fees {
    return new Fees(props);
  }
}
