import { IDTOMapper } from 'src/app/shared/application/dto-mapper.interface';
import { Email } from 'src/app/shared/domain/value-objects/email.value-object';
import { FeesVariants } from '../domain/fees';
import { IPartner, Partner } from '../domain/partner';
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
  inscription?: FeesVariants;
  cash: number;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class PartnerDTOMapper implements IDTOMapper<IPartner, IPartnerDTO> {
  constructor() {}
  // Convierte un objeto DTO a un dominio
  toDomain(dto: IPartnerDTO): IPartner {
    return Partner.create({
      partner_id: dto.partner_id,
      access_code: dto.access_code,
      number: dto.number,
      name: dto.name,
      surname: dto.surname,
      email: Email.create(dto.email),
      phone: dto.phone,
      address: dto.address,
      dni: dto.dni,
      birthday: dto.birthday,
      leaves: dto.leaves,
      cannabis_month: dto.cannabis_month,
      hash_month: dto.hash_month,
      extractions_month: dto.extractions_month,
      others_month: dto.others_month,
      partner_type_id: dto.partner_type_id,
      therapeutic: dto.therapeutic,
      active: dto.active,
      sanctions: dto.sanctions,
      fee: dto.fee,
      inscription: dto.inscription,
      cash: dto.cash,
      user_created: dto.user_created,
      user_updated: dto.user_updated,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
    });
  }

  // Convierte un dominio a un objeto DTO
  toDTO(domain: IPartner): IPartnerDTO {
    const {
      partner_id,
      access_code,
      number,
      name,
      surname,
      email,
      phone,
      address,
      dni,
      birthday,
      leaves,
      cannabis_month,
      hash_month,
      extractions_month,
      others_month,
      partner_type_id,
      active,
      therapeutic,
      fee,
      inscription,
      sanctions,
      cash,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    } = domain;
    return {
      partner_id: domain.partner_id,
      access_code: undefined,
      number: domain.number,
      name: domain.name,
      surname: domain.surname,
      email: domain.email.value,
      phone: domain.phone,
      address: domain.address,
      dni: domain.dni,
      birthday: domain.birthday,
      leaves: domain.leaves,
      cannabis_month: domain.cannabis_month,
      hash_month: domain.hash_month,
      extractions_month: domain.extractions_month,
      others_month: domain.others_month,
      partner_type_id: domain.partner_type_id,
      active: domain.active,
      therapeutic: domain.therapeutic,
      fee: domain.fee,
      inscription: domain.inscription,
      sanctions: domain.sanctions,
      cash: domain.cash,
      user_created: domain.user_created,
      user_updated: domain.user_updated,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toDTOList(domainList: IPartner[]): IPartnerDTO[] {
    return domainList.map((partner) => this.toDTO(partner));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(dtoList: IPartnerDTO[]): IPartner[] {
    return dtoList.map((partnerDTO) => this.toDomain(partnerDTO));
  }
}
