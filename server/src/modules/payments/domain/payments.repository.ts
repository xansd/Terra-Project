import { IAccount, IPayments, PaymentType } from "./payments";

export interface IPaymentsRepository {
  getById(id: string): Promise<IPayments>;
  getAccountById(id: string): Promise<IAccount | null>;
  getAllAccounts(): Promise<IAccount[]>;
  getAllByType(type: PaymentType): Promise<IPayments[]>;
  getAllByReference(referenceId: string): Promise<IPayments[]>;
  create(payment: IPayments, user: string): Promise<IPayments>;
  delete(id: string, user: string): Promise<void>;
  updateAccountBalance(
    accountId: string,
    value: number,
    user: string
  ): Promise<void>;
  getAllByAccount(account: string): Promise<IPayments[]>;
}
