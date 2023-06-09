import { IDTOMapper } from "../../shared/application/dto-mapper.interface";
import { Email } from "../../shared/domain/value-objects/email.value-object";
import { IPartner, Partner } from "../domain/partner";
import { PartnerID } from "../domain/value-objects/partner-id.value.object";
import { IPartnerDTO, IPartnerSubsetDTO } from "./partner.dto";

export class PartnerMapper implements IDTOMapper<IPartner, IPartnerDTO> {
  constructor() {}
  // Convierte un DTO a un dominio
  toDomain(dto: IPartnerDTO): IPartner {
    const partner_id = dto.partner_id
      ? PartnerID.create(dto.partner_id)
      : PartnerID.create();
    const access_code = dto.access_code ? dto.access_code : undefined;
    const number = dto.number;
    const name = dto.name;
    const surname = dto.surname;
    const email = Email.create(dto.email);
    const phone = dto.phone;
    const address = dto.address;
    const dni = dto.dni ? dto.dni : undefined;
    const birthday = dto.birthday;
    const leaves = dto.leaves;
    const cannabis_month = dto.cannabis_month;
    const hash_month = dto.hash_month;
    const extractions_month = dto.extractions_month;
    const others_month = dto.others_month;
    const partner_type_id = dto.partner_type_id;
    const active = dto.active;
    const therapeutic = dto.therapeutic;
    const sanctions = dto.sanctions;
    const fee = dto.fee;
    const inscription = dto.inscription;
    const cash = dto.cash;
    const user_created = dto.user_created;
    const user_updated = dto.user_updated;
    const props = {
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
      sanctions,
      fee,
      inscription,
      cash,
      user_created,
      user_updated,
    };

    return Partner.create(props);
  }

  // Convierte un dominio a un DTO
  toDTO(domain: IPartner): IPartnerDTO {
    return {
      partner_id: domain.partner_id.value,
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
      sanctions: domain.sanctions,
      fee: domain.fee,
      inscription: domain.inscription,
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

  // Convierte un dominio a un DTO
  toDTOFiltered(domain: IPartner): IPartnerSubsetDTO {
    return {
      partner_id: domain.partner_id.value,
      access_code: undefined,
      number: domain.number,
      name: domain.name,
      surname: domain.surname,
      dni: domain.dni!,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toDTOFilteredList(domainList: IPartner[]): IPartnerSubsetDTO[] {
    return domainList.map((partner) => {
      return {
        partner_id: partner.partner_id.value,
        number: partner.number,
        access_code: partner.access_code,
        name: partner.name,
        surname: partner.surname,
        dni: partner.dni!,
      };
    });
  }
}
