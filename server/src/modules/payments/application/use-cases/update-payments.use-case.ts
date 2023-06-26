import { IPayments } from "../../domain/payments";
import { IPaymentsRepository } from "../../domain/payments.repository";
import { IPaymentsDTO, PaymentMapper } from "../payments-dto.mapper";

export interface IUpdatePayments {
  create(payment: IPaymentsDTO): Promise<IPayments>;
  delete(id: string): Promise<void>;
}

export class UpdatePayments implements IUpdatePayments {
  private paymentMapper: PaymentMapper = new PaymentMapper();
  paymentDomain!: IPayments;

  constructor(private readonly paymentsRepository: IPaymentsRepository) {}

  async create(payment: IPaymentsDTO): Promise<IPayments> {
    this.paymentDomain = this.paymentMapper.toDomain(payment);
    const paymentRepository = await this.paymentsRepository.create(
      this.paymentDomain
    );
    return paymentRepository;
  }
  async delete(id: string): Promise<void> {
    const result = await this.paymentsRepository.delete(id);
    return result;
  }
}
