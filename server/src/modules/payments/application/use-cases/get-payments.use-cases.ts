import Logger from "../../../../apps/utils/logger";
import { IPayments, PaymentType } from "../../domain/payments";
import { PaymentDoesNotExistError } from "../../domain/payments.exception";
import { IPaymentsRepository } from "../../domain/payments.repository";

export interface IGetPayments {
  getById(id: string): Promise<IPayments>;
  getAllByType(type: PaymentType): Promise<IPayments[]>;
  getAllByReference(referenceId: string): Promise<IPayments[]>;
}

export class GetPayments implements IGetPayments {
  constructor(private readonly paymentsRepository: IPaymentsRepository) {}
  async getById(id: string): Promise<IPayments> {
    const payment = await this.paymentsRepository.getById(id);
    if (!payment) {
      Logger.error(
        `payment-repository : getById : ${PaymentDoesNotExistError}`
      );
      throw new PaymentDoesNotExistError();
    }
    return payment;
  }

  async getAllByType(type: PaymentType): Promise<IPayments[]> {
    const payments = await this.paymentsRepository.getAllByType(type);
    if (payments.length === 0) {
      const paymentNotFound = new PaymentDoesNotExistError();
      Logger.error(
        `payment-repository : getAllByType : ${PaymentDoesNotExistError}`
      );
      throw paymentNotFound;
    }

    return payments;
  }

  async getAllByReference(referenceId: string): Promise<IPayments[]> {
    const payments = await this.paymentsRepository.getAllByReference(
      referenceId
    );
    // if (payments.length === 0) {
    //   const paymentNotFound = new PaymentDoesNotExistError();
    //   Logger.error(
    //     `payment-repository : getAllByType : ${PaymentDoesNotExistError}`
    //   );
    //   throw paymentNotFound;
    // }

    return payments;
  }
}
