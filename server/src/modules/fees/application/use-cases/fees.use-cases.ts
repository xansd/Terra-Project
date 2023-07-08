import { UpdatePayments } from "../../../payments/application/use-cases/update-payments.use-case";
import { PaymentType } from "../../../payments/domain/payments";
import { IPaymentsRepository } from "../../../payments/domain/payments.repository";
import { DatetimeHelperService } from "../../../shared/application/datetime.helper.service";
import { UpdateTransactions } from "../../../transactions/application/use-cases/update-transactions.use-case";
import { ITransactionsRepository } from "../../../transactions/domain/transactions.repository";
import { IFees, FeesVariants } from "../../domain/fees";
import { NotANumberError } from "../../domain/fees.exceptions";
import { MysqlFeesRepository } from "../../infrastructure/mysql-fees.repository";
import { FeesDTOMapper } from "../fees.mapper";
import { IFeesDTO } from "../fees.mapper";
import config from "../../../../config/app-config";
import { FeesService } from "../fees.service";
import { IPurchasesRepository } from "../../../purchases/domain/purchases.repository";
import { IFeesRepository } from "../../domain/fees.repository";

export interface IFeesUseCases {
  getPartnerFees(partnerId: string): Promise<IFees[] | null>;
  getAllFees(): Promise<IFees[] | null>;
  createFee(fee: IFeesDTO, user: string): Promise<IFees | null>;
  updateFee(fee: IFeesDTO, user: string): Promise<IFees | null>;
  deleteFee(feeId: string, user: string): Promise<void>;
  getTypes(): Promise<FeesVariants[]>;
  payFee(fee: IFees, token: any, user: string): Promise<void>;
  renewFee(fee: IFeesDTO, user: string): Promise<IFees | null>;
}

export class FeesUseCases implements IFeesUseCases {
  incomeObject = new UpdateTransactions(this.transactionsRepository);
  paymentObject = new UpdatePayments(
    this.paymentsRepository,
    this.transactionsRepository,
    this.purchasesRepositrory,
    this.feesRepository
  );
  feesMapper = new FeesDTOMapper();
  feesService = new FeesService();
  constructor(
    private readonly feesRepository: IFeesRepository,
    private readonly transactionsRepository: ITransactionsRepository,
    private readonly paymentsRepository: IPaymentsRepository,
    private readonly purchasesRepositrory: IPurchasesRepository
  ) {}

  async createFee(fee: IFeesDTO, user: string): Promise<IFees | null> {
    let result = null;
    const feeDomain = this.feesMapper.toDomain(fee);
    const expiration = DatetimeHelperService.dateToString(new Date());

    // CUOTA NO EXENTA SIN VTO (nueva)
    if (
      this.feesService.isFee(fee) &&
      !this.feesService.isFeeExent(fee) &&
      !fee.expiration
    ) {
      const lastTypeFee = await this.feesRepository.getLastTypeFee(fee);
      if (
        lastTypeFee &&
        expiration < DatetimeHelperService.dateToString(lastTypeFee.expiration!)
      ) {
        feeDomain.expiration = DatetimeHelperService.dateToString(
          lastTypeFee.expiration
        );
      } else feeDomain.expiration = expiration;
      result = await this.feesRepository.create(feeDomain, user);
      // CUOTA NO EXENTA CON VTO (renovacion)
    } else if (
      this.feesService.isFee(fee) &&
      !this.feesService.isFeeExent(fee) &&
      fee.expiration
    ) {
      result = await this.feesRepository.create(feeDomain, user);
      // INSCRIPCION NO EXENTA
    } else if (
      this.feesService.isInscription(fee) &&
      !this.feesService.isInscriptionExent(fee)
    ) {
      feeDomain.expiration = expiration;
      result = await this.feesRepository.create(feeDomain, user);
      // COUTA O INSCRIPCION EXENTAS (se crean sin VTO)
    } else if (
      this.feesService.isFee(fee) &&
      this.feesService.isFeeExent(fee)
    ) {
      feeDomain.expiration = null;
      result = await this.feesRepository.create(feeDomain, user);
    } else {
      result = await this.feesRepository.create(feeDomain, user);
    }

    return result;
  }
  async getPartnerFees(partnerId: string): Promise<IFees[] | null> {
    const fees = await this.feesRepository.getById(partnerId);
    return fees;
  }
  async getAllFees(): Promise<IFees[] | null> {
    const fees = await this.feesRepository.getAll();
    return fees;
  }
  async updateFee(fee: IFeesDTO, user: string): Promise<IFees | null> {
    const deleteFee = await this.deleteFee(fee.fee_id?.toString()!, user);
    const create = await this.createFee(fee, user);
    return create;
  }
  async deleteFee(feeId: string, user: string): Promise<void> {
    const result = await this.feesRepository.delete(feeId, user);
    return result;
  }
  async getTypes(): Promise<FeesVariants[]> {
    const types = await this.feesRepository.getTypes();
    return types;
  }

  async payFee(fee: IFees, user: string): Promise<void> {
    const paid = DatetimeHelperService.dateToString(new Date());

    // Actualizamos la cuota a pagada
    const executePayment = await this.feesRepository.payFee(
      fee.fee_id?.toString()!,
      paid,
      user
    );

    // Crear ingreso y cobro de la cuota
    this.createIncomeRecipe(fee, user);

    // Si no es una inscripcion la renovamos
    if (this.feesService.isFee(fee)) this.renewFee(fee, user);
    //else if (this.isInscription(fee)) return executePayment;
    return executePayment;
  }

  async renewFee(fee: IFeesDTO, user: string): Promise<IFees | null> {
    const period = config.FEES_PERIOD;
    const prevExpiration = new Date(fee.expiration!);
    const newExpiration = DatetimeHelperService.dateToString(
      new Date(prevExpiration.setMonth(prevExpiration.getMonth() + period))
    );
    fee.expiration = newExpiration;
    const execute = await this.createFee(fee, user);
    return execute;
  }

  // Crea los registros contables de la cuota pagada
  private async createIncomeRecipe(fee: IFees, user: string) {
    let amount = 0;
    const feeType = this.feesService.getFeesTypeString(fee.fees_type_id);
    amount = Number(feeType.slice(-2));
    if (isNaN(amount)) {
      throw new NotANumberError();
    }
    await this.incomeObject.create({
      transaction_id: undefined,
      code: undefined,
      amount: amount,
      notes: `Ingreso de ${feeType}`,
      transaction_type_id: this.feesService
        .getTransactionsTypeId(fee)
        .toString(),
      recurrence_days: 0,
      recurrence_times: 0,
      date_start: DatetimeHelperService.dateToString(new Date()),
      interest: 0,
      user_created: user,
    });
    await this.paymentObject.create(
      {
        type: PaymentType.COBRO,
        reference_id: fee.fee_id?.toString()!,
        amount: amount,
        notes: `Cobro de ${feeType}`,
      },
      user
    );
  }
}
