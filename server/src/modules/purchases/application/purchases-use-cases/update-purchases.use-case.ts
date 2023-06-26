import Logger from "../../../../apps/utils/logger";
import { DomainValidationError } from "../../../shared/domain/domain-validation.exception";
import { IPurchase } from "../../domain/purchases";
import { IPurchasesRepository } from "../../domain/purchases.repository";
import { IPurchaseDTO, PurchasesMapper } from "../purchases-dto.mapper";

export interface IUpdatePurchase {
  createPurchase(purchase: IPurchaseDTO): Promise<IPurchase>;
  updatePurchase(purchase: IPurchaseDTO): Promise<void>;
  deletePurchase(id: string): Promise<void>;
}

export class UpdatePurchase implements IUpdatePurchase {
  private purchaseMapper: PurchasesMapper = new PurchasesMapper();
  purchaseDomain!: IPurchase;

  constructor(private readonly purchaseRepository: IPurchasesRepository) {}

  async createPurchase(purchase: IPurchaseDTO): Promise<IPurchase> {
    this.purchaseDomain = this.purchaseMapper.toDomain(purchase);
    const purchaseRepository = await this.purchaseRepository.createPurchase(
      this.purchaseDomain
    );
    return purchaseRepository;
  }

  async updatePurchase(purchase: IPurchaseDTO): Promise<void> {
    try {
      this.purchaseDomain = this.purchaseMapper.toDomain(purchase);
      const result = await this.purchaseRepository.updatePurchase(
        this.purchaseDomain
      );
      return result;
    } catch (error) {
      if (error instanceof DomainValidationError) {
        Logger.error(
          `updatePurchase : DomainValidationError : domain validation error`
        );
        throw new DomainValidationError(error.message);
      }
      throw error;
    }
  }

  async deletePurchase(id: string): Promise<void> {
    const result = await this.purchaseRepository.deletePurchase(id);
    return result;
  }
}
