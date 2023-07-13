import { IPersistenceMapper } from "../../shared/infraestructure/persistence-mapper.interface";
import { ITransactions } from "../domain/transactions";
import { TransactionsCode } from "../domain/value-objects/code-id.value-object";
import { TransactionsID } from "../domain/value-objects/transactions-id.value.object";

export interface ITransactionsPersistence {
  transaction_id?: string;
  code?: string;
  transaction_type_id: string;
  transaction_type_name?: string;
  transaction_category?: string | null;
  amount: number;
  recurrence_days?: number | null;
  recurrence_times?: number | null;
  date_start?: string | null;
  interest?: number | null;
  notes?: string | null;
  source_account_id?: string | null;
  destination_account_id?: string | null;
  partner_id?: string | null;
  fee_id?: number;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class TransactionsPersistenceMapper
  implements IPersistenceMapper<ITransactions, ITransactionsPersistence>
{
  constructor() {}
  toDomain(persistence: ITransactionsPersistence): ITransactions {
    return {
      transaction_id: TransactionsID.create(persistence.transaction_id),
      code: TransactionsCode.create(
        TransactionsID.create(persistence.transaction_id),
        persistence.code
      ),
      transaction_type_id: persistence.transaction_type_id,
      transaction_type_name: persistence.transaction_type_name,
      transaction_category: persistence.transaction_category,
      amount: persistence.amount,
      recurrence_days: persistence.recurrence_days,
      recurrence_times: persistence.recurrence_times,
      date_start: persistence.date_start,
      interest: persistence.interest,
      notes: persistence.notes,
      source_account_id: persistence.source_account_id,
      destination_account_id: persistence.destination_account_id,
      partner_id: persistence.partner_id,
      fee_id: persistence.fee_id,
      user_created: persistence.user_created,
      user_updated: persistence.user_updated,
      created_at: persistence.created_at,
      updated_at: persistence.updated_at,
      deleted_at: persistence.deleted_at,
    };
  }
  toPersistence(domain: ITransactions): ITransactionsPersistence {
    const {
      transaction_id,
      code,
      transaction_type_id,
      transaction_type_name,
      transaction_category,
      amount,
      recurrence_days,
      recurrence_times,
      date_start,
      interest,
      notes,
      source_account_id,
      destination_account_id,
      partner_id,
      fee_id,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    } = domain;
    return {
      transaction_id: transaction_id?.value,
      transaction_type_name: transaction_type_name,
      transaction_category: transaction_category,
      code: code?.value,
      transaction_type_id: transaction_type_id,
      amount: amount,
      recurrence_days: recurrence_days,
      recurrence_times: recurrence_times,
      date_start: date_start,
      interest: interest,
      notes: notes,
      source_account_id: source_account_id,
      destination_account_id: destination_account_id,
      partner_id: partner_id,
      fee_id: fee_id,
      user_created: user_created,
      user_updated: user_updated,
      created_at: created_at,
      updated_at: updated_at,
      deleted_at: deleted_at,
    };
  }
  toPersistenceList(domainList: ITransactions[]): ITransactionsPersistence[] {
    return domainList.map((transaction) => this.toPersistence(transaction));
  }
  toDomainList(persistenceList: ITransactionsPersistence[]): ITransactions[] {
    return persistenceList.map((transactionPersistence) =>
      this.toDomain(transactionPersistence)
    );
  }
}
