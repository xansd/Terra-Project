import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { IPartnerSubsetDTO } from "../application/partner.dto";
import { IPartner, IPartnersType, ISanctions } from "../domain/partner";
import {
  Number20Limit,
  PartnerDoesNotExistError,
  PartnersNotFoundError,
  SanctionDoesNotExists,
  SanctionErrorCreate,
} from "../domain/partner.exceptions";
import { IPartnerRepository } from "../domain/partner.repository";
import { PartnerPersistenceMapper } from "./partner-persistence.mapper";

export class MySqlPartnerRepository implements IPartnerRepository {
  private partnerPersistenceMapper: PartnerPersistenceMapper =
    new PartnerPersistenceMapper();

  async getById(partnerId: string): Promise<IPartner> {
    const rows = await MysqlDataBase.query(
      `SELECT partners.*, 
      IF(COUNT(sanctions.sanction_id) > 0,
         JSON_ARRAYAGG(
             JSON_OBJECT('sanction_id', sanctions.sanction_id,
                         'partner_id', sanctions.partner_id,
                         'severity', sanctions.severity,
                         'description', sanctions.description,
                         'user_created', sanctions.user_created,
                         'created_at', sanctions.created_at)
             ),
         JSON_ARRAY()
      ) AS sanctions
FROM partners
LEFT JOIN (
 SELECT *
 FROM sanctions
 WHERE deleted_at IS NULL
) AS sanctions ON partners.partner_id = sanctions.partner_id
WHERE partners.partner_id = ? 
 AND partners.deleted_at IS NULL
GROUP BY partners.partner_id
ORDER BY partners.number ASC;

`,
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
      `SELECT partners.*, 
      IF(COUNT(sanctions.sanction_id) > 0,
          JSON_ARRAYAGG(
              JSON_OBJECT('sanction_id', sanctions.sanction_id,
                          'partner_id', sanctions.partner_id,
                          'severity', sanctions.severity,
                          'description', sanctions.description,
                          'user_created', sanctions.user_created,
                          'created_at', sanctions.created_at)
          ),
          JSON_ARRAY()
      ) AS sanctions,
      (SELECT expiration 
       FROM fees 
       WHERE partner_id = partners.partner_id 
       AND fees_type_id = 1 
       ORDER BY created_at DESC 
       LIMIT 1) AS fee_expiration
  FROM partners
  LEFT JOIN sanctions ON partners.partner_id = sanctions.partner_id
  WHERE partners.deleted_at IS NULL 
  GROUP BY partners.partner_id
  ORDER BY partners.number ASC;   
    `
    );
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : PartnersNotFoundError`);
      throw new PartnersNotFoundError();
    }
    return this.partnerPersistenceMapper.toDomainList(rows) as IPartner[];
  }

  async getAllFiltered(): Promise<IPartnerSubsetDTO[]> {
    const rows = await MysqlDataBase.query(
      `SELECT partner_id, access_code, number, name, surname, dni FROM partners
      where deleted_at IS NULL  AND leaves IS NULL AND active = 1 ORDER BY number ASC`
    );
    // if (rows.length === 0) {
    //   Logger.error(`mysql : getAll : PartnersNotFoundError`);
    //   throw new PartnersNotFoundError();
    // }
    return this.partnerPersistenceMapper.toDtoFilteredList(
      rows
    ) as unknown as IPartnerSubsetDTO[];
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
    const insertQuery = `INSERT INTO partners (partner_id, access_code, number, name, surname, email, phone, address, dni, birth_date, cannabis_month, hash_month, extractions_month, others_month, partner_type_id, active, fee, inscription, debt_limit, user_created) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?)`;

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
      partnerPersistence.fee!.toString(),
      partnerPersistence.inscription!.toString(),
      partnerPersistence.debt_limit!.toString(),
      partnerPersistence.user_created!,
    ]);
    const selectResult = await MysqlDataBase.query(selectQuery);
    const partnerSaved = selectResult[0];

    Logger.info(`mysql : createPartner : ${partnerPersistence.user_created!}`);
    return this.partnerPersistenceMapper.toDomain(partnerSaved);
  }
  async update(partner: IPartner): Promise<void> {
    const partnerPersistence =
      this.partnerPersistenceMapper.toPersistence(partner);
    const result = await MysqlDataBase.update(
      `UPDATE partners SET name = ?, surname = ?, email = ?, phone = ?, address = ?, dni = ?, birth_date = ?,
       cannabis_month = ?, hash_month = ?, extractions_month = ?, others_month = ?, partner_type_id = ?,
        active = ?, therapeutic = ?, fee = ?, cash = ?, inscription = ?, debt_limit = ?, user_updated = ?
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
        partnerPersistence.fee!.toString(),
        partnerPersistence.cash.toString(),
        partnerPersistence.inscription!.toString(),
        partnerPersistence.debt_limit!.toString(),
        partnerPersistence.user_updated!,
        partnerPersistence.partner_id,
      ]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : updatePartner : PartnerDoesNotExistError`);
      throw new PartnerDoesNotExistError();
    }
    Logger.info(`mysql : updatePartner : ${partnerPersistence.user_updated!}`);
    return result;
  }

  async delete(partnerId: string, user: string): Promise<void> {
    const deleteFees = await MysqlDataBase.update(
      `DELETE FROM fees WHERE partner_id = ?`,
      [partnerId]
    );

    Logger.info(`mysql : deletePartnerFees : ${user}`);
    const result = await MysqlDataBase.update(
      // `UPDATE partners SET deleted_at = NOW(), user_updated = ? WHERE partner_id = ?`,
      // [user, partnerId]
      `DELETE FROM partners WHERE partner_id = ?`,
      [partnerId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : deletePartner : PartnerDoesNotExistError`);
      throw new PartnerDoesNotExistError();
    }
    Logger.info(`mysql : deletePartner : ${user}`);
    return result;
  }
  async makeActive(partnerId: string, user: string): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE partners SET active = ?, user_updated = ? WHERE partner_id = ?",
      ["1", user, partnerId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : activatePartner : PartnerDoesNotExistError`);
      throw new PartnerDoesNotExistError();
    }
    Logger.info(`mysql : makeActive : ${user}`);
    return result;
  }
  async makeInactive(partnerId: string, user: string): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE partners SET active = ?, user_updated = ? WHERE partner_id = ?",
      ["0", user, partnerId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : blockPartner : PartnerDoesNotExistError`);
      throw new PartnerDoesNotExistError();
    }
    Logger.info(`mysql : makeInactive : ${user}`);
    return result;
  }

  async partnerLeaves(partnerId: string, user: string): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE partners SET leaves = NOW(), active = ?, user_updated = ?  WHERE partner_id = ?",
      ["0", user, partnerId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : partnerLeaves : PartnerDoesNotExistError`);
      throw new PartnerDoesNotExistError();
    }
    Logger.info(`mysql : partnerLeaves : ${user}`);
    return result;
  }

  async updateAccessCode(
    accessCode: string,
    partnerId: string,
    user: string
  ): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE partners SET access_code = ?, user_updated = ? WHERE partner_id = ?",
      [accessCode, partnerId, user]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : partnerLeaves : PartnerDoesNotExistError`);
      throw new PartnerDoesNotExistError();
    }
    Logger.info(`mysql : updateAccessCode : ${user}`);
    return result;
  }

  async checkPartnerExistenceByEmail(email: string): Promise<boolean> {
    const partner = await MysqlDataBase.query(
      `SELECT * FROM partners WHERE email = ? and deleted_at IS NULL and leaves IS NULL`,
      [email]
    );
    return !!partner.length;
  }

  async updatePartnerCash(
    amount: number,
    partnerId: string,
    user: string
  ): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE partners SET cash = ? WHERE partner_id = ?",
      [amount.toString(), partnerId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : partnerLeaves : PartnerDoesNotExistError`);
      throw new PartnerDoesNotExistError();
    }
    Logger.info(`mysql : updatePartnerCash : ${user}`);
    return result;
  }

  async getPartnerCash(partnerId: string): Promise<{ cash: number }> {
    const rows = await MysqlDataBase.query(
      `SELECT cash FROM partners WHERE partner_id = ?`,
      [partnerId]
    );
    return rows[0];
  }

  async createSanction(
    sanction: ISanctions,
    user: string
  ): Promise<ISanctions> {
    const insertQuery = `INSERT INTO sanctions (partner_id, severity, description, user_created) VALUES (?,?,?,?)`;

    const selectQuery = `SELECT * FROM sanctions ORDER BY created_at DESC LIMIT 1`;

    await MysqlDataBase.update(insertQuery, [
      sanction.partner_id,
      sanction.severity.toString(),
      sanction.description,
      user,
    ]);
    const selectResult = await MysqlDataBase.query(selectQuery);
    if (!selectResult) {
      Logger.error(`mysql : createSanction : SanctionErrorCreate`);
      throw new SanctionErrorCreate();
    }
    Logger.info(`mysql : createSanction : ${user}`);
    return selectResult[0];
  }

  async deleteSanction(id: string, user: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE sanctions SET deleted_at = NOW(), user_updated = ?  WHERE sanction_id = ?`,
      [user, id]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : deleteSanction : SanctionDoesNotExists`);
      throw new SanctionDoesNotExists();
    }
    Logger.info(`mysql : deleteSanction : ${user}`);
    return result;
  }
}
