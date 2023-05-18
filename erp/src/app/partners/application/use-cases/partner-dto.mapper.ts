import { IDTOMapper } from 'src/app/shared/application/dto-mapper.interface';
import { IPartner } from '../../domain/partner';
import { IPartnerDTO } from './partner.dto';

export class UserDTOMapper implements IDTOMapper<IPartner, IPartnerDTO> {
  constructor() {}
  // Convierte un objeto DTO a un dominio
  toDomain(dto: IPartnerDTO): IPartner {
    return Partner.create({
      partner_id: dto.partner_id,
      name: dto.name,
      email: dto.email,
      password: dto.password,
      password_last_reset: dto.password_last_reset,
    });
  }

  // Convierte un dominio a un objeto DTO
  toDTO(domain: IPartner): IPartnerDTO {
    const {} = domain;
    return {};
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
