import { IPayments, PaymentType } from "./payments";

export interface IPaymentsRepository {
  getById(id: string): Promise<IPayments>;
  getAll(type: PaymentType): Promise<IPayments[]>;
  create(payment: IPayments): Promise<IPayments>;
  delete(id: string): Promise<void>;
}
