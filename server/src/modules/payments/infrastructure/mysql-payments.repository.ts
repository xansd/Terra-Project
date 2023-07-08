import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { IPayments, PaymentType } from "../domain/payments";
import {
  PaymentCreationError,
  PaymentDoesNotExistError,
  PaymentNotFoundError,
} from "../domain/payments.exception";
import { IPaymentsRepository } from "../domain/payments.repository";
import { PaymentsPersistenceMapper } from "./payments-persistence.mapper";
import { Request, Response } from "express";

export class MySqlPaymentsRepository implements IPaymentsRepository {
  private paymentsPersistenceMapper: PaymentsPersistenceMapper =
    new PaymentsPersistenceMapper();

  async getById(id: string): Promise<IPayments> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM payments WHERE payment_id = ? AND deleted_at IS NULL`,
      [id]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : getById : PaymentDoesNotExistError`);
      throw new PaymentDoesNotExistError();
    }
    return this.paymentsPersistenceMapper.toDomain(rows[0]) as IPayments;
  }

  async getAllByType(type: PaymentType): Promise<IPayments[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM payments WHERE deleted_at IS NULL AND type = ?`,
      [type]
    );
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : PaymentNotFoundError`);
      throw new PaymentNotFoundError();
    }
    return this.paymentsPersistenceMapper.toDomainList(rows) as IPayments[];
  }

  async getAllByReference(referenceId: string): Promise<IPayments[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM payments WHERE deleted_at IS NULL AND reference_id = ?`,
      [referenceId]
    );
    // if (rows.length === 0) {
    //   Logger.error(`mysql : getAll : PaymentNotFoundError`);
    //   throw new PaymentNotFoundError();
    // }
    return (
      (this.paymentsPersistenceMapper.toDomainList(rows) as IPayments[]) || []
    );
  }

  async create(payment: IPayments, user: string): Promise<IPayments> {
    const paymentPersistence =
      this.paymentsPersistenceMapper.toPersistence(payment);
    const insertQuery = `INSERT INTO payments (type, reference_id, amount, notes, user_created) VALUES (?,?,?,?, ?)`;

    const selectQuery = `SELECT * FROM payments WHERE payment_id = LAST_INSERT_ID()`;
    try {
      await MysqlDataBase.update(insertQuery, [
        paymentPersistence.type,
        paymentPersistence.reference_id,
        paymentPersistence.amount!.toString(),
        paymentPersistence.notes!,
        user,
      ]);
    } catch (error) {
      throw new PaymentCreationError();
    }
    const selectResult = await MysqlDataBase.query(selectQuery);
    const lastPaymentInserted = selectResult[0];
    Logger.info(`mysql : createPayment : ${user}`);
    return this.paymentsPersistenceMapper.toDomain(lastPaymentInserted);
  }

  async delete(id: string, user: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE payments SET deleted_at = NOW(), user_updated = ? WHERE payment_id = ?`,
      [user, id]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : delete : PaymentDoesNotExistError`);
      throw new PaymentDoesNotExistError();
    }
    Logger.info(`mysql : deletePayment : ${user}`);
    return result;
  }
}
