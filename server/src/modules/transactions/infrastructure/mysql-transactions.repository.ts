import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { ITransactions, TransactionCategoryType } from "../domain/transactions";
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

  async getById(id: string): Promise<ITransactions> {
    const rows = await MysqlDataBase.query(
      `SELECT * from transactions WHERE transaction_id = ? AND deleted_at IS NULL`,
      [id]
    );
    if (isNil(rows[0])) {
      Logger.error(
        `mysql : getTransactionsById : TransactionDoesNotExistError`
      );
      throw new TransactionDoesNotExistError();
    }

    return this.transactionsPersistenceMapper.toDomain(
      rows[0]
    ) as ITransactions;
  }

  async getAllExpenses(): Promise<ITransactions[]> {
    const query = `
      SELECT t.* 
      FROM transactions t
      INNER JOIN transaction_type tt ON t.transaction_type_id = tt.transaction_type_id
      WHERE tt.transaction_category = '${TransactionCategoryType.GASTO}'
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
      SELECT t.* 
      FROM transactions t
      INNER JOIN transaction_type tt ON t.transaction_type_id = tt.transaction_type_id
      WHERE tt.transaction_category = '${TransactionCategoryType.INGRESO}'
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
      SELECT *
      FROM transactions
      WHERE transaction_type = '${transactionType}'
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
    const insertQuery = `INSERT INTO transactions (transaction_id, code, amount, notes, transaction_type_id, recurrence_days, recurrence_times, date_start, interest, user_created)
     VALUES (?,?,?,?,?,?,?,?,?,?)`;

    try {
      await MysqlDataBase.update(insertQuery, [
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
      ]);
    } catch (error) {
      throw new TransactionCreationError();
    }

    const selectQuery = `SELECT * FROM transactions ORDER BY created_at DESC LIMIT 1`;
    const selectResult = await MysqlDataBase.query(selectQuery);
    const lastTransactionInserted = selectResult[0];

    return this.transactionsPersistenceMapper.toDomain(lastTransactionInserted);
  }

  async delete(id: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE transactions SET deleted_at = NOW() WHERE transactions_id = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : delete : TransactionDoesNotExistError`);
      throw new TransactionDoesNotExistError();
    }
    return result;
  }
}
