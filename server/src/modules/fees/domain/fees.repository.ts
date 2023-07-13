import { IFees, FeesVariants } from "./fees";

export interface IFeesRepository {
  getById(partnerId: string): Promise<IFees[]>;
  getAll(): Promise<IFees[]>;
  create(fee: IFees, user: string): Promise<IFees>;
  update(fee: IFees, user: string): Promise<IFees>;
  delete(feeId: string, user: string): Promise<void>;
  getTypes(): Promise<FeesVariants[]>;
  payFee(
    feeId: string,
    transaction: string,
    paid: string,
    user: string
  ): Promise<void>;
  getLastTypeFee(fee: IFees): Promise<IFees>;
  // refundFee(feeId: string): Promise<void>; --Se llamará desde la tabla de cuotas/inscripciones del historial del socio
}
