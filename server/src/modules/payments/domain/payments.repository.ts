import { IPayments, PaymentType } from "./payments";

export interface IPaymentsRepository {
  getById(id: string): Promise<IPayments>;
  getAllByType(type: PaymentType): Promise<IPayments[]>;
  getAllByReference(referenceId: string): Promise<IPayments[]>;
  create(payment: IPayments, user: string): Promise<IPayments>;
  delete(id: string, user: string): Promise<void>;
}
