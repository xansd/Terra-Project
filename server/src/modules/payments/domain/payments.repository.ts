import { IPayments, PaymentType } from "./payments";

export interface IPaymentsRepository {
  getById(id: string): Promise<IPayments>;
  getAllByType(type: PaymentType): Promise<IPayments[]>;
  getAllByReference(referenceId: string): Promise<IPayments[]>;
  create(payment: IPayments): Promise<IPayments>;
  delete(id: string): Promise<void>;
}
