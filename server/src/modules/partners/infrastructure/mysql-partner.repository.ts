import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { IPartner, IPartnersType } from "../domain/partner";
import {
  Number20Limit,
  PartnerDoesNotExistError,
  PartnersNotFoundError,
} from "../domain/partner.exceptions";
import { IPartnerRepository } from "../domain/partner.repository";
import { PartnerPersistenceMapper } from "./partner-persistence.mapper";

export class MySqlPartnerRepository implements IPartnerRepository {
  private partnerPersistenceMapper: PartnerPersistenceMapper =
    new PartnerPersistenceMapper();

  async getById(partnerId: string): Promise<IPartner> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM partners WHERE partner_id = ? and deleted_at IS NULL`,
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
      `SELECT * FROM partners where deleted_at IS NULL ORDER BY number ASC`
    );
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : PartnersNotFoundError`);
      throw new PartnersNotFoundError();
    }
    return this.partnerPersistenceMapper.toDomainList(rows) as IPartner[];
  }

  async getTypes(): Promise<IPartnersType[]> {
    const rows = await MysqlDataBase.query(`SELECT * FROM partner_type`);
    return rows as unknown as IPartnersType[];
  }

  async getPartnerLastNumber(): Promise<any> {
    const rows = await MysqlDataBase.query(
      `SELECT number FROM partners ORDER BY number DESC LIMIT 1;`
    );
    return rows as unknown as number;
  }

  async getNextNumber(): Promise<number[]> {
    const query1 = `SELECT MAX(number) AS maxNumber FROM partners WHERE number < 20`;
    const query2 = `SELECT MAX(number) AS maxNumber FROM partners WHERE number >= 20`;

    const result1 = await MysqlDataBase.query(query1);
    const result2 = await MysqlDataBase.query(query2);

    const maxNumberGroup1 = result1[0].maxNumber;
    const maxNumberGroup2 = result2[0].maxNumber;

    const nextNumberGroup1 = maxNumberGroup1 ? maxNumberGroup1 + 1 : 1;
    const nextNumberGroup2 = maxNumberGroup2 ? maxNumberGroup2 + 1 : 20;

    if (nextNumberGroup1 === 20) {
      Logger.error(": mysql : nextNumberGroup : No se puede sobrepasar el n20");
      throw new Number20Limit();
    }

    return [nextNumberGroup1, nextNumberGroup2];
  }

  async create(partner: IPartner): Promise<IPartner> {
    let partnerNumber: string | number = 0;
    let partnerMaxNumbers: number[] = await this.getNextNumber();
    if (partner.partner_type_id > 1) partnerNumber = partnerMaxNumbers[0];
    else partnerNumber = partnerMaxNumbers[1];
    const partnerPersistence =
      this.partnerPersistenceMapper.toPersistence(partner);
    const insertQuery = `INSERT INTO partners (partner_id, access_code, number, name, surname, email, phone, address, dni, birth_date, cannabis_month, hash_month, extractions_month, others_month, partner_type_id, active, user_created) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const selectQuery = `SELECT * FROM partners ORDER BY created_at DESC LIMIT 1`;

    const insertResult = await MysqlDataBase.update(insertQuery, [
      partnerPersistence.partner_id,
      partnerPersistence.access_code!,
      partnerNumber as unknown as string,
      partnerPersistence.name,
      partnerPersistence.surname,
      partnerPersistence.email,
      partnerPersistence.phone,
      partnerPersistence.address,
      partnerPersistence.dni!,
      partnerPersistence.birth_date,
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
    console.log(
      partnerPersistence.name,
      partnerPersistence.surname,
      partnerPersistence.email,
      partnerPersistence.phone,
      partnerPersistence.address,
      partnerPersistence.dni!,
      partnerPersistence.birth_date,
      partnerPersistence.cannabis_month.toString(),
      partnerPersistence.hash_month.toString(),
      partnerPersistence.extractions_month.toString(),
      partnerPersistence.others_month.toString(),
      partnerPersistence.partner_type_id.toString(),
      partnerPersistence.active.toString(),
      partnerPersistence.therapeutic.toString(),
      partnerPersistence.user_updated!,
      partnerPersistence.partner_id
    );
    const result = await MysqlDataBase.update(
      `UPDATE partners SET name = ?, surname = ?, email = ?, phone = ?, address = ?, dni = ?, birth_date = ?,
       cannabis_month = ?, hash_month = ?, extractions_month = ?, others_month = ?, partner_type_id = ?, active = ?, therapeutic = ?, user_updated = ?
       WHERE partner_id = ?`,
      [
        partnerPersistence.name,
        partnerPersistence.surname,
        partnerPersistence.email,
        partnerPersistence.phone,
        partnerPersistence.address,
        partnerPersistence.dni!,
        partnerPersistence.birth_date,
        partnerPersistence.cannabis_month.toString(),
        partnerPersistence.hash_month.toString(),
        partnerPersistence.extractions_month.toString(),
        partnerPersistence.others_month.toString(),
        partnerPersistence.partner_type_id.toString(),
        partnerPersistence.active.toString(),
        partnerPersistence.therapeutic.toString(),
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
      `SELECT * FROM partners WHERE email = ? and deleted_at IS NULL`,
      [email]
    );
    return !!partner.length;
  }

  // async uploadPartnerDocument(partnerId: string, file: File): Promise<void> {
  //   throw new Error("Method not implemented.");
  // }
  // async getPartnerDocument(partnerId: string): Promise<any> {
  //   throw new Error("Method not implemented.");
  // }
  // async getAllPartnerDocuments(partnerId: string): Promise<any> {
  //   throw new Error("Method not implemented.");
  // }
  // async deletePartnerDocument(documentId: string): Promise<void> {
  //   throw new Error("Method not implemented.");
  // }
}
