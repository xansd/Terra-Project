import { DatetimeHelperService } from "../../../shared/application/datetime.helper.service";
import { IFees, FeesVariants } from "../../domain/fees";
import { FeeNotFoundError } from "../../domain/fees.exceptions";
import { MysqlFeesRepository } from "../../infrastructure/mysql-fees.repository";
import { FeesDTOMapper } from "../fees.mapper";
import { IFeesDTO } from "../fees.mapper";

export interface IFeesUseCases {
  getPartnerFees(partnerId: string): Promise<IFees[] | null>;
  getAllFees(): Promise<IFees[] | null>;
  createFee(fee: IFeesDTO): Promise<IFees | null>;
  updateFee(fee: IFeesDTO): Promise<IFees | null>;
  deleteFee(feeId: string): Promise<void>;
  getTypes(): Promise<FeesVariants[]>;
  payFee(fee: IFees): Promise<void>;
  renewFee(fee: IFeesDTO): Promise<IFees | null>;
}

export class FeesUseCases implements IFeesUseCases {
  feesMapper = new FeesDTOMapper();
  constructor(private readonly feesRepository: MysqlFeesRepository) {}

  async createFee(fee: IFeesDTO): Promise<IFees | null> {
    let result = null;
    const feeDomain = this.feesMapper.toDomain(fee);
    const expiration = DatetimeHelperService.dateToString(new Date());

    // CUOTA NO EXENTA SIN VTO (nueva)
    if (this.isFee(fee) && !this.isFeeExent(fee) && !fee.expiration) {
      feeDomain.expiration = expiration;
      result = await this.feesRepository.create(feeDomain);
      // CUOTA NO EXENTA CON VTO (renovacion)
    } else if (this.isFee(fee) && !this.isFeeExent(fee) && fee.expiration) {
      result = await this.feesRepository.create(feeDomain);
      // INSCRIPCION NO EXENTA
    } else if (this.isInscription(fee) && !this.isInscriptionExent(fee)) {
      feeDomain.expiration = expiration;
      result = await this.feesRepository.create(feeDomain);
      // COUTA O INSCRIPCION EXENTAS (se crean sin VTO)
    } else if (
      (this.isInscription(fee) && this.isInscriptionExent(fee)) ||
      (this.isFee(fee) && this.isFeeExent(fee))
    ) {
      result = await this.feesRepository.create(feeDomain);
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
  async updateFee(fee: IFeesDTO): Promise<IFees | null> {
    const _fee = await this.feesRepository.update(fee);
    return _fee;
  }
  async deleteFee(feeId: string): Promise<void> {
    const result = await this.feesRepository.delete(feeId);
    return result;
  }
  async getTypes(): Promise<FeesVariants[]> {
    const types = await this.feesRepository.getTypes();
    return types;
  }

  async payFee(fee: IFees): Promise<void> {
    const paid = DatetimeHelperService.dateToString(new Date());
    const executePayment = await this.feesRepository.payFee(
      fee.fee_id?.toString()!,
      paid
    );
    // Si no es una inscripcion la renovamos
    if (this.isFee(fee)) this.renewFee(fee);
    //else if (this.isInscription(fee)) return executePayment;
    return executePayment;
  }

  async renewFee(fee: IFeesDTO): Promise<IFees | null> {
    const period = 12;
    const prevExpiration = new Date(fee.expiration!);
    const newExpiration = DatetimeHelperService.dateToString(
      new Date(prevExpiration.setMonth(prevExpiration.getMonth() + period))
    );
    fee.expiration = newExpiration;
    const execute = await this.createFee(fee);
    return execute;
  }

  isFee(fee: IFees): boolean {
    if (fee.fees_type_id > 2) return false;
    return true;
  }
  isInscription(fee: IFees): boolean {
    if (fee.fees_type_id > 2) return true;
    return false;
  }

  isFeeExent(fee: IFees): boolean {
    if (fee.fees_type_id === 2) return true;
    return false;
  }

  isInscriptionExent(fee: IFees): boolean {
    if (fee.fees_type_id === 3) return true;
    return false;
  }
}
