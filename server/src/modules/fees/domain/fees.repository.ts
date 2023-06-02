import { IFees, FeesVariants } from "./fees";

export interface IFeesRepository {
  getById(partnerId: string): Promise<IFees[]>;
  getAll(): Promise<IFees[]>;
  create(fee: IFees): Promise<IFees>;
  update(fee: IFees): Promise<IFees>;
  delete(feeId: string): Promise<void>;
  getTypes(): Promise<FeesVariants[]>;
  payFee(feeId: string, paid: string, newExpiration: string): Promise<void>;
}
