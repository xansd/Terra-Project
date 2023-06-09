import { Email } from "../../shared/domain/value-objects/email.value-object";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { IPersistenceMapper } from "../../shared/infraestructure/persistence-mapper.interface";
import { IPartner, Partner } from "../domain/partner";
import { PartnerID } from "../domain/value-objects/partner-id.value.object";
import {
  IPartnerPersistence,
  IPartnerPersistenceSubset,
} from "./partner.persistence";

export class PartnerPersistenceMapper
  implements IPersistenceMapper<IPartner, IPartnerPersistence>
{
  constructor() {}
  // Convierte un objeto de la base de datos a un dominio
  toDomain(persistence: IPartnerPersistence): IPartner {
    return Partner.create({
      partner_id: PartnerID.create(persistence.partner_id),
      access_code: persistence.access_code,
      number: persistence.number.toString(),
      name: persistence.name,
      surname: persistence.surname,
      email: Email.create(persistence.email),
      phone: persistence.phone,
      address: persistence.address,
      dni: persistence.dni,
      birthday: persistence.birth_date,
      leaves: persistence.leaves,
      cannabis_month: persistence.cannabis_month,
      hash_month: persistence.hash_month,
      extractions_month: persistence.extractions_month,
      others_month: persistence.others_month,
      partner_type_id: persistence.partner_type_id,
      active: persistence.active == 1 ? true : false,
      therapeutic: persistence.therapeutic == 1 ? true : false,
      sanctions: persistence.sanctions,
      fee: persistence.fee,
      inscription: persistence.inscription,
      cash: persistence.cash,
      user_created: persistence.user_created,
      user_updated: persistence.user_updated,
      created_at: persistence.created_at,
      updated_at: persistence.updated_at,
      deleted_at: persistence.deleted_at,
    });
  }

  // Convierte un dominio a un objeto de la base de datos
  toPersistence(domain: IPartner): IPartnerPersistence {
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
      sanctions,
      fee,
      inscription,
      cash,
      user_created,
      user_updated,
    } = domain;
    return {
      partner_id: partner_id.value,
      access_code: access_code ? access_code : null,
      number: Number(number),
      name: name,
      surname: surname,
      email: email.value,
      phone: phone,
      address: address,
      dni: dni ? dni : null,
      birth_date: MysqlDataBase.toMySQLDateTime(birthday),
      leaves: leaves ? leaves : null,
      cannabis_month: cannabis_month,
      hash_month: hash_month,
      extractions_month: extractions_month,
      others_month: others_month,
      partner_type_id: partner_type_id,
      active: active == true ? 1 : 0,
      therapeutic: therapeutic == true ? 1 : 0,
      sanctions: sanctions,
      fee: fee,
      inscription: inscription,
      cash: cash,
      user_created: user_created ? user_created : null,
      user_updated: user_updated ? user_updated : null,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toPersistenceList(domainList: IPartner[]): IPartnerPersistence[] {
    return domainList.map((partner) => this.toPersistence(partner));
  }

  toDtoFilteredList(
    persistenceList: IPartnerPersistenceSubset[]
  ): IPartnerPersistenceSubset[] {
    return persistenceList.map((partner) => {
      return {
        partner_id: partner.partner_id,
        number: partner.number,
        access_code: partner.access_code,
        name: partner.name,
        surname: partner.surname,
        dni: partner.dni,
      };
    });
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(persistenceList: IPartnerPersistence[]): IPartner[] {
    return persistenceList.map((partnerPersistence) =>
      this.toDomain(partnerPersistence)
    );
  }
}
