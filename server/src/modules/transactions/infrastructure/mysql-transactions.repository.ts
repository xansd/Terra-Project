import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { DeleteFeeTransactionError } from "../../fees/domain/fees.exceptions";
import { IPartner } from "../../partners/domain/partner";
import { PartnerDoesNotExistError } from "../../partners/domain/partner.exceptions";
import { PartnerPersistenceMapper } from "../../partners/infrastructure/partner-persistence.mapper";
import { MySqlPaymentsRepository } from "../../payments/infrastructure/mysql-payments.repository";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import {
  ITransactions,
  TransactionCategoryType,
  TransactionsTypes,
} from "../domain/transactions";
import {
  TransactionCreationError,
  TransactionDoesNotExistError,
  TransactionNotFoundError,
} from "../domain/transactions.exception";
import { ITransactionsRepository } from "../domain/transactions.repository";
import { TransactionsPersistenceMapper } from "./transactions-persistence.mapper";

export class MySqlTransactionsRepository implements ITransactionsRepository {
  private transactionsPersistenceMapper: TransactionsPersistenceMapper =
    new TransactionsPersistenceMapper();
  private paymentsRepository: MySqlPaymentsRepository =
    new MySqlPaymentsRepository();

  async getById(id: string): Promise<ITransactions | null> {
    const query = `
        SELECT t.*, tt.name as transaction_type_name, tt.transaction_category as transaction_category
        FROM transactions t
        INNER JOIN transaction_type tt ON t.transaction_type_id = tt.transaction_type_id
        WHERE t.transaction_id = ? AND t.deleted_at IS NULL
      `;
    const rows = await MysqlDataBase.query(query, [id]);
    if (isNil(rows[0])) {
      Logger.error(
        `mysql : getTransactionsById : TransactionDoesNotExistError`
      );
      return null;
    }
    const paymentQuery = `
        SELECT *
        FROM payments
        WHERE reference_id = ? AND deleted_at IS NULL
      `;
    const payments = await MysqlDataBase.query(paymentQuery, [id]);

    const transaction = rows[0];
    const transactionWithType = {
      ...transaction,
      transaction_type_name: transaction.transaction_type_name,
      transaction_category: transaction.transaction_category,
      payments: payments || [],
    };

    return this.transactionsPersistenceMapper.toDomain(
      transactionWithType
    ) as ITransactions;
  }

  async getPartnerAccountTransactions(id: string): Promise<ITransactions[]> {
    const query = `
      SELECT t.*
      FROM transactions t
      WHERE t.partner_id = ?
        AND t.deleted_at IS NULL
        AND t.transaction_type_id IN (?, ?)
        ORDER BY t.created_at DESC
    `;

    const transactionType1 = TransactionsTypes.INGRESO_CUENTA_SOCIO;
    const transactionType2 = TransactionsTypes.REINTEGRO_CUENTA_SOCIO;

    const rows = await MysqlDataBase.query(query, [
      id,
      transactionType1.toString(),
      transactionType2.toString(),
    ]);
    return this.transactionsPersistenceMapper.toDomainList(
      rows
    ) as ITransactions[];
  }

  async getAllTransactions(): Promise<ITransactions[]> {
    const query = `SELECT t.*, tt.name as transaction_type_name, tt.transaction_category as transaction_category
    FROM transactions t
    INNER JOIN transaction_type tt ON t.transaction_type_id = tt.transaction_type_id
    WHERE t.deleted_at IS NULL ORDER BY t.created_at ASC`;
    const rows = await MysqlDataBase.query(query);
    if (rows.length === 0) {
      Logger.error(`mysql : getAllTransactions : TransactionNotFoundError`);
      throw new TransactionNotFoundError();
    }
    return this.transactionsPersistenceMapper.toDomainList(
      rows
    ) as ITransactions[];
  }

  async getAllExpenses(): Promise<ITransactions[]> {
    const query = `
        SELECT t.*, tt.name as transaction_type_name
        FROM transactions t
        INNER JOIN transaction_type tt ON t.transaction_type_id = tt.transaction_type_id
        WHERE tt.transaction_category = '${TransactionCategoryType.GASTO}
        ' AND t.deleted_at IS NULL 
      `;
    const rows = await MysqlDataBase.query(query);
    if (rows.length === 0) {
      Logger.error(`mysql : getAllExpenses : ExpensesNotFoundError`);
      throw new TransactionNotFoundError();
    }
    return this.transactionsPersistenceMapper.toDomainList(
      rows
    ) as ITransactions[];
  }

  async getAllIncomes(): Promise<ITransactions[]> {
    const query = `
        SELECT t.*, tt.name as transaction_type_name
        FROM transactions t
        INNER JOIN transaction_type tt ON t.transaction_type_id = tt.transaction_type_id
        WHERE tt.transaction_category = '${TransactionCategoryType.INGRESO}' AND t.deleted_at IS NULL 
      `;
    const rows = await MysqlDataBase.query(query);
    if (rows.length === 0) {
      Logger.error(`mysql : getAllIncomes : IncomesNotFoundError`);
      throw new TransactionNotFoundError();
    }
    return this.transactionsPersistenceMapper.toDomainList(
      rows
    ) as ITransactions[];
  }

  async getAllTransactionsByType(
    transactionType: string
  ): Promise<ITransactions[]> {
    const query = `
        SELECT t.*, tt.name as transaction_type_name
        FROM transactions t
        INNER JOIN transaction_type tt ON t.transaction_type_id = tt.transaction_type_id
        WHERE t.transaction_type = '${transactionType}'
      `;
    const rows = await MysqlDataBase.query(query);
    if (rows.length === 0) {
      Logger.error(
        `mysql : getAllTransactionsByType : TransactionsNotFoundError`
      );
      throw new TransactionNotFoundError();
    }
    return this.transactionsPersistenceMapper.toDomainList(
      rows
    ) as ITransactions[];
  }

  async create(transaction: ITransactions): Promise<ITransactions> {
    const transactionPersistence =
      this.transactionsPersistenceMapper.toPersistence(transaction);
    let insertQuery = `INSERT INTO transactions
      (transaction_id, code, amount, notes, transaction_type_id, recurrence_days, recurrence_times,
      date_start, interest, user_created`;

    const insertParams = [
      transactionPersistence.transaction_id!,
      transactionPersistence?.code!,
      transactionPersistence.amount.toString(),
      transactionPersistence.notes!,
      transactionPersistence.transaction_type_id!,
      transactionPersistence.recurrence_days?.toString()!,
      transactionPersistence.recurrence_times?.toString()!,
      transactionPersistence.date_start?.toString()!,
      transactionPersistence.interest?.toString()!,
      transactionPersistence.user_created!,
    ];

    if (transactionPersistence.partner_id) {
      insertQuery += `, partner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      insertParams.push(transactionPersistence.partner_id);
    } else {
      insertQuery += `) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    }

    try {
      await MysqlDataBase.update(insertQuery, insertParams);
    } catch (error) {
      throw new TransactionCreationError();
    }

    const selectQuery = `SELECT * FROM transactions ORDER BY created_at DESC LIMIT 1`;
    const selectResult = await MysqlDataBase.query(selectQuery);
    const lastTransactionInserted = selectResult[0];

    Logger.info(
      `mysql : createTransaction ${transactionPersistence.user_created}`
    );
    return this.transactionsPersistenceMapper.toDomain(lastTransactionInserted);
  }

  async delete(id: string, user: string): Promise<void> {
    const sql = `
      UPDATE payments SET deleted_at = NOW(), user = ? WHERE reference_id = ?;
      UPDATE transactions SET deleted_at = NOW(), user = ? WHERE transactions_id = ?;
    `;
    const args = [user, id, user, id];

    const result = await MysqlDataBase.update(sql, args);

    if (result[0].affectedRows === 0 || result[1].affectedRows === 0) {
      Logger.error(`mysql : delete : TransactionDoesNotExistError`);
      throw new TransactionDoesNotExistError();
    }

    Logger.info(`mysql : deleteTransaction ${user}`);
  }

  async deleteFeeTransaction(
    feeId: string,
    transactionid: string,
    user: string
  ): Promise<void> {
    const updateQuery = `
    UPDATE fees SET paid = NULL WHERE fee_id = ?;
  `;

    const deleteQuery = `
    DELETE FROM fees
    WHERE fee_id = (SELECT fee_id FROM fees WHERE fees_type_id = (
        SELECT fees_type_id
        FROM fees
        WHERE fee_id = ?
      )
      AND fee_id > ? ORDER BY fee_id ASC LIMIT 1
    );
  `;
    try {
      await MysqlDataBase.update(updateQuery, [feeId]);
      await MysqlDataBase.update(deleteQuery, [feeId, feeId]);
      await this.delete(transactionid, user);
    } catch (error) {
      Logger.error(`mysql : deleteFeeTransaction : DeleteFeeTransactionError`);
      throw new DeleteFeeTransactionError();
    }
  }
}
