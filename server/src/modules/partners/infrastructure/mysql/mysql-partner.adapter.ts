import { isNil } from "../../../../../shared/type-checkers";
import Logger from "../../../../apps/utils/logger";
import { MysqlDataBase } from "../../../shared/infraestructure/mysql/mysql";
import { IPartner } from "../../domain/partner";
import {
  PartnerDoesNotExistError,
  PartnersNotFoundError,
} from "../../domain/partner.exceptions";
import { IPartnerRepository } from "../../domain/partner.repository";
import { PartnerPersistenceMapper } from "../partner-persistence.mapper";

export class MySqlPartnerRepository implements IPartnerRepository {
  private partnerPersistenceMapper: PartnerPersistenceMapper =
    new PartnerPersistenceMapper();

  async getById(partnerId: string): Promise<IPartner> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM partners WHERE partner_id = ? and deleted_at is null`,
      [partnerId]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : getById : PartnerDoesNotExistError`);
      throw new PartnerDoesNotExistError();
    }

    return this.partnerPersistenceMapper.toDomain(rows[0]) as IPartner;
  }
  async getAll(): Promise<IPartner[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM partners where deleted_at is null`
    );
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : PartnersNotFoundError`);
      throw new PartnersNotFoundError();
    }
    return this.partnerPersistenceMapper.toDomainList(rows) as IPartner[];
  }
  async create(partner: IPartner): Promise<IPartner> {
    const partnerPersistence =
      this.partnerPersistenceMapper.toPersistence(partner);
    const insertQuery = `INSERT INTO partners (  
    partner_id, access_code, number,name, surname, email, phone, address, dni, birthday, registration, cannabis_month, hash_month, extractions_month, others_month, partner_type_id, active, user_created
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const selectQuery = `SELECT * FROM partners ORDER BY created_at DESC LIMIT 1`;
    const insertResult = await MysqlDataBase.update(insertQuery, [
      partnerPersistence.partner_id,
      partnerPersistence.access_code!,
      partnerPersistence.number.toString(),
      partnerPersistence.name,
      partnerPersistence.surname,
      partnerPersistence.email,
      partnerPersistence.phone,
      partnerPersistence.address,
      partnerPersistence.dni!,
      partnerPersistence.birthday,
      partnerPersistence.registration,
      partnerPersistence.cannabis_month.toString(),
      partnerPersistence.hash_month.toString(),
      partnerPersistence.extractions_month.toString(),
      partnerPersistence.others_month.toString(),
      partnerPersistence.partner_type_id.toString(),
      partnerPersistence.active.toString(),
      partnerPersistence.user_created!,
    ]);
    const selectResult = await MysqlDataBase.query(selectQuery);
    const partnerSaved = selectResult[0];

    return this.partnerPersistenceMapper.toDomain(partnerSaved);
  }
  async update(partner: IPartner): Promise<IPartner> {
    const partnerPersistence =
      this.partnerPersistenceMapper.toPersistence(partner);
    const result = await MysqlDataBase.update(
      `UPDATE users SET access_code = ?, name = ?, surname = ?, email = ?, phone = ?, address = ?, dni = ?, birthday = ?,
       cannabis_month = ?, hash_month = ?, extractions_month = ?, others_month = ?, partner_type_id = ?, active = ?, user_updated = ?
       WHERE partner_id = ?`,
      [
        partnerPersistence.access_code!,
        partnerPersistence.name,
        partnerPersistence.surname,
        partnerPersistence.email,
        partnerPersistence.phone,
        partnerPersistence.address,
        partnerPersistence.dni!,
        partnerPersistence.birthday,
        partnerPersistence.cannabis_month.toString(),
        partnerPersistence.hash_month.toString(),
        partnerPersistence.extractions_month.toString(),
        partnerPersistence.others_month.toString(),
        partnerPersistence.partner_type_id.toString(),
        partnerPersistence.active.toString(),
        partnerPersistence.user_updated!,
        partnerPersistence.partner_id,
      ]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : updatePartner : PartnerDoesNotExistError`);
      throw new PartnerDoesNotExistError();
    }
    return result;
  }
  async delete(partnerId: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE partners SET deleted_at = NOW() WHERE partner_id = ?`,
      [partnerId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : deletePartner : PartnerDoesNotExistError`);
      throw new PartnerDoesNotExistError();
    }
    return result;
  }
  async makeActive(partnerId: string): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE partners SET active = ? WHERE user_id = ?",
      ["1", partnerId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : activatePartner : PartnerDoesNotExistError`);
      throw new PartnerDoesNotExistError();
    }
    return result;
  }
  async makeInactive(partnerId: string): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE partners SET active = ? WHERE user_id = ?",
      ["0", partnerId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : blockPartner : PartnerDoesNotExistError`);
      throw new PartnerDoesNotExistError();
    }
    return result;
  }

  async checkPartnerExistenceByEmail(email: string): Promise<boolean> {
    const partner = await MysqlDataBase.query(
      `SELECT * FROM partners WHERE email = ? and deleted_at is null`,
      [email]
    );
    return !!partner.length;
  }

  async uploadPartnerDocument(partnerId: string, file: File): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getPartnerDocument(partnerId: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async getAllPartnerDocuments(partnerId: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async deletePartnerDocument(documentId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
