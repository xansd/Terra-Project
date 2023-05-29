import { Email } from "../../shared/domain/value-objects/email.value-object";
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
      birth_date: this.toMySQLDateTime(birthday),
      leaves: leaves ? leaves : null,
      cannabis_month: cannabis_month,
      hash_month: hash_month,
      extractions_month: extractions_month,
      others_month: others_month,
      partner_type_id: partner_type_id,
      active: active == true ? 1 : 0,
      therapeutic: therapeutic == true ? 1 : 0,
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
      };
    });
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(persistenceList: IPartnerPersistence[]): IPartner[] {
    return persistenceList.map((partnerPersistence) =>
      this.toDomain(partnerPersistence)
    );
  }

  toMySQLDateTime(d: any): string {
    // Construir la fecha
    const date = new Date(d.year, d.month - 1, d.day);

    // Obtener los componentes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = "00";
    const minutes = "00";
    const seconds = "00";

    // Formatear la fecha en formato datetime de MySQL
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    console.log(formattedDate);
    return formattedDate;
  }
}
