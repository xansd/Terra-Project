import { IDTOMapper } from 'src/app/shared/application/dto-mapper.interface';
import { IPartner, Partner } from '../domain/partner';
import { IPartnerDTO } from './partner.dto';
import { Email } from 'src/app/shared/domain/value-objects/email.value-object';
import { UntypedFormGroup } from '@angular/forms';
import { FormMode } from 'src/app/ui/services/app-state.service';

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
      extractions_month: domain.hash_month,
      others_month: domain.hash_month,
      partner_type_id: domain.hash_month,
      active: domain.active,
      therapeutic: domain.therapeutic,
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

  createPartnerFormData(
    form: UntypedFormGroup,
    mode: FormMode,
    user: string,
    partnerId?: string
  ): IPartner {
    const formValues = form.value;
    const id = partnerId ? partnerId : undefined;
    const partnerData: IPartner = {
      name: formValues.name,
      surname: formValues.surname,
      dni: formValues.dni,
      email: formValues.email,
      phone: formValues.phone,
      address: formValues.address,
      birthday: formValues.birth,
      cannabis_month: formValues.cannabis,
      hash_month: formValues.hash,
      extractions_month: formValues.extractions,
      others_month: formValues.others,
      partner_type_id: formValues.type,
      active: formValues.active,
      therapeutic: formValues.therapeutic,
    };

    if (mode === FormMode.CREATE) {
      partnerData.user_created = user;
    } else if (FormMode.UPDATE) {
      partnerData.user_updated = user;
    }

    if (id) {
      partnerData.partner_id = id;
    }

    return partnerData;
  }
}
