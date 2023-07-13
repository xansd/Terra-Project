import { UpdatePayments } from "../../../payments/application/use-cases/update-payments.use-case";
import { PaymentType } from "../../../payments/domain/payments";
import { IPaymentsRepository } from "../../../payments/domain/payments.repository";
import { DatetimeHelperService } from "../../../shared/application/datetime.helper.service";
import { UpdateTransactions } from "../../../transactions/application/use-cases/update-transactions.use-case";
import { ITransactionsRepository } from "../../../transactions/domain/transactions.repository";
import { IFees, FeesVariants, FeesAmount } from "../../domain/fees";
import { FeePaymentError, NotANumberError } from "../../domain/fees.exceptions";
import { FeesDTOMapper } from "../fees.mapper";
import { IFeesDTO } from "../fees.mapper";
import config from "../../../../config/app-config";
import { FeesService } from "../fees.service";
import { IPurchasesRepository } from "../../../purchases/domain/purchases.repository";
import { IFeesRepository } from "../../domain/fees.repository";
import { PartnerCashService } from "../../../partners/application/services/partner-cash.service";
import {
  IPartner,
  OperationPartnerCash,
} from "../../../partners/domain/partner";
import { IPartnerRepository } from "../../../partners/domain/partner.repository";
import { UpdatePartnerUseCase } from "../../../partners/application/use-cases/update-partner.use-case";
import { IPartnerDTO } from "../../../partners/application/partner.dto";
import Logger from "../../../../apps/utils/logger";
import { PartnerMapper } from "../../../partners/application/partner-dto.mapper";
import { PartnerInsufficientBalance } from "../../../partners/domain/partner.exceptions";

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
  partnerDTOMapper: PartnerMapper = new PartnerMapper();
  partnerCashService = new PartnerCashService();
  incomeObject = new UpdateTransactions(this.transactionsRepository!);
  paymentObject = new UpdatePayments(
    this.paymentsRepository!,
    this.transactionsRepository!,
    this.purchasesRepositrory!,
    this.feesRepository!
  );
  feesMapper = new FeesDTOMapper();
  feesService = new FeesService();
  partnerService = new UpdatePartnerUseCase(
    this.partnerRepository!,
    this.transactionsRepository!,
    this.paymentsRepository!,
    this.purchasesRepositrory!,
    this.partnerCashService,
    this.feesRepository!
  );
  constructor(
    private readonly feesRepository?: IFeesRepository,
    private readonly transactionsRepository?: ITransactionsRepository,
    private readonly paymentsRepository?: IPaymentsRepository,
    private readonly purchasesRepositrory?: IPurchasesRepository,
    private readonly partnerRepository?: IPartnerRepository
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
      const lastTypeFee = await this.feesRepository!.getLastTypeFee(fee);
      if (
        lastTypeFee &&
        expiration < DatetimeHelperService.dateToString(lastTypeFee.expiration!)
      ) {
        feeDomain.expiration = DatetimeHelperService.dateToString(
          lastTypeFee.expiration
        );
      } else feeDomain.expiration = expiration;
      result = await this.feesRepository!.create(feeDomain, user);
      // CUOTA NO EXENTA CON VTO (renovacion)
    } else if (
      this.feesService.isFee(fee) &&
      !this.feesService.isFeeExent(fee) &&
      fee.expiration
    ) {
      result = await this.feesRepository!.create(feeDomain, user);
      // INSCRIPCION NO EXENTA
    } else if (
      this.feesService.isInscription(fee) &&
      !this.feesService.isInscriptionExent(fee)
    ) {
      feeDomain.expiration = expiration;
      result = await this.feesRepository!.create(feeDomain, user);
      // COUTA O INSCRIPCION EXENTAS (se crean sin VTO)
    } else if (
      this.feesService.isFee(fee) &&
      this.feesService.isFeeExent(fee)
    ) {
      feeDomain.expiration = null;
      result = await this.feesRepository!.create(feeDomain, user);
    } else {
      result = await this.feesRepository!.create(feeDomain, user);
    }

    return result;
  }
  async getPartnerFees(partnerId: string): Promise<IFees[] | null> {
    const fees = await this.feesRepository!.getById(partnerId);
    return fees;
  }
  async getAllFees(): Promise<IFees[] | null> {
    const fees = await this.feesRepository!.getAll();
    return fees;
  }
  async updateFee(fee: IFeesDTO, user: string): Promise<IFees | null> {
    const deleteFee = await this.deleteFee(fee.fee_id?.toString()!, user);
    const create = await this.createFee(fee, user);
    return create;
  }
  async deleteFee(feeId: string, user: string): Promise<void> {
    const result = await this.feesRepository!.delete(feeId, user);
    return result;
  }
  async getTypes(): Promise<FeesVariants[]> {
    const types = await this.feesRepository!.getTypes();
    return types;
  }

  async setFeeAsUnpaid(fee: IFees, user: string): Promise<void> {}

  async payFee(fee: IFees, account: string, user: string): Promise<void> {
    // Fecha del pago
    const paid = DatetimeHelperService.dateToString(new Date());
    // Cantidad a abonar de cuota
    let amount =
      Number(this.feesService.getAmountByFeesType(fee.fees_type_id)) || 0;
    // Variable que contendrá el objeto de creación del pago
    let executePayment: any;

    // Socio
    const partner: IPartner = await this.partnerRepository!.getById(
      fee.partner_id!
    );
    const partnerDTO: IPartnerDTO = this.partnerDTOMapper.toDTO(partner);
    // Retiramos la cantidad a abonar por la cuota de la cuenta del socio
    try {
      const balance = await this.partnerService.updatePartnerCash(
        amount.toString(),
        OperationPartnerCash.FEE_PAYMENT,
        partnerDTO,
        account,
        user
      );
      // Crear ingreso y cobro de la cuota
      const transaction = await this.createTransaction(
        fee,
        amount,
        account,
        user
      );

      const transactionId = transaction.transaction_id?.value;

      // Actualizamos la cuota a pagada
      executePayment = await this.feesRepository!.payFee(
        fee.fee_id?.toString()!,
        transactionId!,
        paid,
        user
      );
    } catch (error) {
      if (error instanceof PartnerInsufficientBalance) {
        Logger.error(
          `payFee : PartnerInsufficientBalance : Saldo socio insuficiente durante el pago de la cuota.`
        );
        throw new PartnerInsufficientBalance();
      } else {
        Logger.error(
          `payFee : FeePaymentError : Error durante el pago de la cuota.`
        );
        throw new FeePaymentError();
      }
    }

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
  private async createTransaction(
    fee: IFees,
    feeAmount: number,
    account: string,
    user: string
  ) {
    let amount = feeAmount;
    const feeType = this.feesService.getFeesTypeString(fee.fees_type_id);
    if (isNaN(amount)) {
      throw new NotANumberError();
    }
    const transaction = await this.incomeObject.create({
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
      partner_id: fee.partner_id,
      fee_id: fee.fee_id,
      user_created: user,
    });
    await this.paymentObject.create(
      {
        type: PaymentType.COBRO,
        reference_id: transaction.transaction_id?.value!,
        amount: amount,
        account_id: account,
        notes: `Cobro de ${feeType}`,
      },
      user
    );
    return transaction;
  }
}
