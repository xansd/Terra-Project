import { IDTOMapper } from "../../shared/application/dto-mapper.interface";
import { Fees, IFees } from "../domain/fees";

export interface IFeesDTO {
  fee_id?: number;
  partner_id?: string;
  fees_type_id: number;
  expiration?: string | null;
  paid?: number | boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class FeesDTOMapper implements IDTOMapper<IFees, IFeesDTO> {
  constructor() {}

  toDomain(dto: IFeesDTO): IFees {
    const {
      fee_id,
      partner_id,
      fees_type_id,
      expiration,
      paid,
      created_at,
      updated_at,
      deleted_at,
    } = dto;
    return Fees.create(dto);
  }

  toDTO(domain: IFees): IFeesDTO {
    return {
      fee_id: domain.fee_id,
      partner_id: domain.partner_id,
      expiration: domain.expiration,
      fees_type_id: domain.fees_type_id,
      paid: domain.paid,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  toDTOList(domainList: IFees[]): IFeesDTO[] {
    return domainList.map((fee) => this.toDTO(fee));
  }

  toDomainList(dtoList: IFeesDTO[]): IFees[] {
    return dtoList.map((feeDTO) => this.toDomain(feeDTO));
  }
}
