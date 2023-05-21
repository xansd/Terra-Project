import { IDTOMapper } from 'src/app/shared/application/dto-mapper.interface';
import { IPartner, Partner } from '../domain/partner';
import { IPartnerDTO } from './partner.dto';
import { Email } from 'src/app/shared/domain/value-objects/email.value-object';

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
      registration: dto.registration,
      leaves: dto.leaves,
      cannabis_month: dto.cannabis_month,
      hash_month: dto.hash_month,
      extractions_month: dto.extractions_month,
      others_month: dto.others_month,
      partner_type_id: dto.partner_type_id,
      active: dto.active,
      user_created: dto.user_created,
      user_updated: dto.user_updated,
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
      registration,
      leaves,
      cannabis_month,
      hash_month,
      extractions_month,
      others_month,
      partner_type_id,
      active,
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
      registration: domain.registration,
      leaves: domain.leaves,
      cannabis_month: domain.cannabis_month,
      hash_month: domain.hash_month,
      extractions_month: domain.hash_month,
      others_month: domain.hash_month,
      partner_type_id: domain.hash_month,
      active: domain.active,
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
