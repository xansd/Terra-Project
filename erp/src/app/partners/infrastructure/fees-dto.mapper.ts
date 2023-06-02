import { IDTOMapper } from 'src/app/shared/application/dto-mapper.interface';
import { IFees, Fees, FeesVariants } from '../domain/fees';

export interface IFeesDTO {
  fee_id?: number;
  partner_id?: string;
  fees_type_id: FeesVariants;
  expiration?: string;
  paid?: number | boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class FeesDTOMapper implements IDTOMapper<IFees, IFeesDTO> {
  constructor() {}

  toDomain(dto: IFeesDTO): IFees {
    return Fees.create({
      fee_id: dto.fee_id,
      partner_id: dto.partner_id,
      fees_type_id: dto.fees_type_id,
      expiration: dto.expiration,
      paid: dto.paid,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
    });
  }
  toDTO(domain: IFees): IFeesDTO {
    const {
      fee_id,
      partner_id,
      fees_type_id,
      expiration,
      paid,
      created_at,
      updated_at,
      deleted_at,
    } = domain;
    return {
      fee_id: domain.fee_id,
      partner_id: domain.partner_id,
      fees_type_id: domain.fees_type_id,
      expiration: domain.expiration,
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
    return dtoList.map((dtoFee) => this.toDomain(dtoFee));
  }
}
