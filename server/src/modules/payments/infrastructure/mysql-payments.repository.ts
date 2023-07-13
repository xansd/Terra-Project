import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import {
  AccountDoesNotExistError,
  AccountNotFoundError,
} from "../../transactions/domain/transactions.exception";
import { IAccount, IPayments, PaymentType } from "../domain/payments";
import {
  PaymentCreationError,
  PaymentDoesNotExistError,
  PaymentNotFoundError,
} from "../domain/payments.exception";
import { IPaymentsRepository } from "../domain/payments.repository";
import { PaymentsPersistenceMapper } from "./payments-persistence.mapper";

export class MySqlPaymentsRepository implements IPaymentsRepository {
  async getAccountById(id: string): Promise<IAccount | null> {
    const query = `SELECT * FROM accounts WHERE account_id = ? AND deleted_at IS NULL`;
    const rows = await MysqlDataBase.query(query, [id]);
    if (isNil(rows[0])) {
      Logger.error(`mysql : getAccountById : AccountDoesNotExistError`);
      throw new AccountDoesNotExistError();
    }
    return rows[0];
  }
  async getAllAccounts(): Promise<IAccount[]> {
    const query = `SELECT * FROM accounts WHERE deleted_at IS NULL`;
    const rows = await MysqlDataBase.query(query);
    if (rows.length === 0) {
      Logger.error(`mysql : getAllAccounts : AccountNotFoundError`);
      throw new AccountNotFoundError();
    }
    return rows;
  }
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

  async getAllByAccount(account: string): Promise<IPayments[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM payments WHERE deleted_at IS NULL AND account_id = ?`,
      [account]
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
    const insertQuery = `INSERT INTO payments (type, reference_id, amount, notes, account_id, user_created) VALUES (?,?,?,?,?,?)`;

    const selectQuery = `SELECT * FROM payments WHERE payment_id = LAST_INSERT_ID()`;
    try {
      await MysqlDataBase.update(insertQuery, [
        paymentPersistence.type,
        paymentPersistence.reference_id,
        paymentPersistence.amount!.toString(),
        paymentPersistence.notes!,
        paymentPersistence.account_id!.toString(),
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

  async updateAccountBalance(
    accountId: string,
    value: number,
    user: string
  ): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE accounts SET balance = ?, user_updated = ? WHERE account_id = ?`,
      [value.toString(), user, accountId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : updateAccountBalance : AccountDoesNotExistError`);
      throw new AccountDoesNotExistError();
    }
    Logger.info(`mysql : updateAccountBalance : ${user}`);
    return result;
  }
}
