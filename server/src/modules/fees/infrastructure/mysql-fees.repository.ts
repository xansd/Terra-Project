import { IFees, FeesVariants } from "../domain/fees";
import { IFeesRepository } from "../domain/fees.repository";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { FeesPersistenceMapper } from "./fees.persistence.mapper";
import Logger from "../../../apps/utils/logger";
import { FeeNotFoundError } from "../domain/fees.exceptions";

export class MysqlFeesRepository implements IFeesRepository {
  private feesPersistenceMapper = new FeesPersistenceMapper();

  async getById(partnerId: string): Promise<IFees[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM fees WHERE partner_id = ? and deleted_at IS NULL`,
      [partnerId]
    );
    return this.feesPersistenceMapper.toDomainList(rows) as IFees[];
  }
  async getAll(): Promise<IFees[]> {
    const rows = await MysqlDataBase.query(`SELECT 
    * FROM fees where deleted_at IS NULL ORDER BY created_at ASC`);
    return this.feesPersistenceMapper.toDomainList(rows) as IFees[];
  }

  async create(fee: IFees, user: string): Promise<IFees> {
    const feesPersistence = this.feesPersistenceMapper.toPersistence(fee);

    const insertQueryParts = [
      "INSERT INTO fees (partner_id, fees_type_id,user_created",
    ];
    const insertQueryValues = [
      feesPersistence.partner_id!.toString(),
      feesPersistence.fees_type_id.toString(),
      user,
    ];

    if (
      feesPersistence.expiration !== undefined &&
      feesPersistence.expiration !== null
    ) {
      insertQueryParts.push("expiration");
      insertQueryValues.push(feesPersistence.expiration.toString());
    }

    const insertQuery = `${insertQueryParts.join(
      ", "
    )}) VALUES (${insertQueryValues.map(() => "?").join(", ")})`;
    const selectQuery = `SELECT * FROM fees ORDER BY created_at DESC LIMIT 1`;

    const insertResult = await MysqlDataBase.update(
      insertQuery,
      insertQueryValues
    );
    const selectResult = await MysqlDataBase.query(selectQuery);
    const _fee = selectResult[0];

    return this.feesPersistenceMapper.toDomain(_fee);
  }

  async update(fee: IFees, user: string): Promise<IFees> {
    const feesPersistence = this.feesPersistenceMapper.toPersistence(fee);
    const result = await MysqlDataBase.update(
      `UPDATE partners SET fees_type_id = ?, user_updated = ? WHERE fee_id = ?`,
      [
        feesPersistence.fees_type_id.toString(),
        user,
        feesPersistence.fee_id?.toString()!,
      ]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : updateFee : FeeNotFoundError`);
      throw new FeeNotFoundError();
    }
    return result;
  }
  async delete(feeId: string, user: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE fees SET deleted_at = NOW(), user_updated = ? WHERE fee_id = ?`,
      [feeId, user]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : deleteFee : FeeNotFoundError`);
      throw new FeeNotFoundError();
    }
    return result;
  }

  // async delete(feeId: string, user: string): Promise<void> {
  //   // Obtener el ID de la transacción de pago asociada a la cuota
  //   const selectQuery = `SELECT payment_transaction_id FROM fees WHERE fee_id = ?`;
  //   const selectResult = await MysqlDataBase.query(selectQuery, [feeId]);
  //   if (selectResult.length === 0 || !selectResult[0].payment_transaction_id) {
  //     throw new FeeNotFoundError();
  //   }
  //   const paymentTransactionId = selectResult[0].payment_transaction_id;

  //   // Marcar como eliminadas las filas en la tabla 'payments'
  //   await MysqlDataBase.update(
  //     `UPDATE payments SET deleted_at = NOW(), user_updated = ? WHERE payment_id = ?`,
  //     [user, paymentTransactionId]
  //   );

  //   // Marcar como eliminadas las filas en la tabla 'transactions'
  //   await MysqlDataBase.update(
  //     `UPDATE transactions SET deleted_at = NOW(), user_updated = ? WHERE transaction_id = ?`,
  //     [user, paymentTransactionId]
  //   );

  //   // Marcar como eliminada la fila en la tabla 'fees'
  //   await MysqlDataBase.update(
  //     `UPDATE fees SET deleted_at = NOW(), user_updated = ? WHERE fee_id = ?`,
  //     [user, feeId]
  //   );
  // }

  async getTypes(): Promise<FeesVariants[]> {
    const rows = await MysqlDataBase.query(`SELECT * FROM fees_type`);
    return rows as unknown as FeesVariants[];
  }

  async payFee(
    feeId: string,
    transaction: string,
    paid: string,
    user: string
  ): Promise<any> {
    const result = await MysqlDataBase.update(
      `UPDATE fees SET paid = ?, payment_transaction_id = ?, user_updated = ? WHERE fee_id = ?`,
      [paid, transaction, user, feeId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : payFee : FeeNotFoundError`);
      throw new FeeNotFoundError();
    }
    return result;
  }

  async getLastTypeFee(fee: IFees): Promise<IFees> {
    const type = fee.fees_type_id;
    const result = await MysqlDataBase.query(
      `SELECT * FROM fees WHERE fees_type_id = ? AND deleted_at IS NOT NULL LIMIT 1`,
      [type.toString()]
    );
    return result[0] as IFees;
  }
}
