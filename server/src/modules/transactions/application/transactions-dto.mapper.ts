import { IDTOMapper } from "../../shared/application/dto-mapper.interface";
import { ITransactions, Transactions } from "../domain/transactions";
import { TransactionsCode } from "../domain/value-objects/code-id.value-object";
import { TransactionsID } from "../domain/value-objects/transactions-id.value.object";

export interface ITransactionsDTO {
  transaction_id: string;
  code?: string;
  transaction_type_id: string;
  amount: number;
  recurrence_days?: number;
  recurrence_times?: number;
  date_start?: string;
  interest?: number;
  notes?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class TransactionsMapper
  implements IDTOMapper<ITransactions, ITransactionsDTO>
{
  constructor() {}
  // Convierte un DTO a un dominio
  toDomain(dto: ITransactionsDTO): ITransactions {
    const transaction_id = dto.transaction_id
      ? TransactionsID.create(dto.transaction_id)
      : TransactionsID.create();
    const code = dto.code
      ? TransactionsCode.create(transaction_id, dto.code)
      : TransactionsCode.create(transaction_id);
    const transaction_type_id = dto.transaction_type_id;
    const amount = dto.amount;
    const recurrence_days = dto.recurrence_days;
    const recurrence_times = dto.recurrence_times;
    const date_start = dto.date_start;
    const interest = dto.interest;
    const notes = dto.notes;
    const user_created = dto.user_created;
    const user_updated = dto.user_updated;
    const created_at = dto.created_at;
    const updated_at = dto.updated_at;
    const deleted_at = dto.deleted_at;

    const props = {
      transaction_id,
      code,
      transaction_type_id,
      amount,
      recurrence_days,
      recurrence_times,
      date_start,
      interest,
      notes,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    };
    return Transactions.create(props);
  }

  // Convierte un dominio a un DTO
  toDTO(domain: ITransactions): ITransactionsDTO {
    return {
      transaction_id: domain.transaction_id.value,
      code: domain.code?.value,
      transaction_type_id: domain.transaction_type_id,
      amount: domain.amount,
      recurrence_days: domain.recurrence_days,
      recurrence_times: domain.recurrence_times,
      date_start: domain.date_start,
      interest: domain.interest,
      notes: domain.notes,
      user_created: domain.user_created,
      user_updated: domain.user_updated,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toDTOList(domainList: ITransactions[]): ITransactionsDTO[] {
    return domainList.map((transaction) => this.toDTO(transaction));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(dtoList: ITransactionsDTO[]): ITransactions[] {
    return dtoList.map((transactionDTO) => this.toDomain(transactionDTO));
  }
}
