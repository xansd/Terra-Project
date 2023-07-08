import Logger from "../../../../apps/utils/logger";
import { InvalidAmountError } from "../../../partners/domain/partner.exceptions";
import { UpdateStockService } from "../../../products/application/services/update-stock.service";
import { StockOperations } from "../../../products/domain/products";
import { IProductRepository } from "../../../products/domain/products.repository";
import { DomainValidationError } from "../../../shared/domain/domain-validation.exception";
import { IPurchase, IPurchaseDetails } from "../../domain/purchases";
import { IPurchasesRepository } from "../../domain/purchases.repository";
import { IPurchaseDTO, PurchasesMapper } from "../purchases-dto.mapper";

export interface IUpdatePurchase {
  createPurchase(purchase: IPurchaseDTO, user: string): Promise<IPurchase>;
  updatePurchase(purchase: IPurchaseDTO, user: string): Promise<void>;
  deletePurchase(id: string, user: string): Promise<void>;
}

export class UpdatePurchase implements IUpdatePurchase {
  private stockService = new UpdateStockService(this.productRepository);
  private purchaseMapper: PurchasesMapper = new PurchasesMapper();
  purchaseDomain!: IPurchase;

  constructor(
    private readonly purchaseRepository: IPurchasesRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async createPurchase(
    purchase: IPurchaseDTO,
    user: string
  ): Promise<IPurchase> {
    this.purchaseDomain = this.purchaseMapper.toDomain(purchase);

    // Actualizamos el stock de los productos comprados
    await this.updateDetailsStock(
      this.purchaseDomain,
      StockOperations.ADD,
      user
    );

    const purchaseRepository = await this.purchaseRepository.createPurchase(
      this.purchaseDomain,
      user
    );
    return purchaseRepository;
  }

  async updateDetailsStock(
    purchase: IPurchase,
    operation: StockOperations,
    user: string
  ): Promise<void> {
    let detail: IPurchaseDetails;
    if (purchase.purchase_details && purchase.purchase_details.length > 0) {
      let quantity = 0;
      for (detail of purchase.purchase_details) {
        if (typeof detail.lot === "number" && detail.lot > 0) {
          quantity = Number(detail.lot) * Number(detail.quantity);
        } else {
          quantity = Number(detail.quantity);
        }

        if (isNaN(quantity)) {
          Logger.error(`createPurchase: InvalidAmountError: valor incorrecto`);
          throw new InvalidAmountError();
        }
        if (operation === StockOperations.ADD) {
          await this.stockService.addProductStock(
            detail.product_id as unknown as string,
            quantity,
            user
          );
        } else if (operation === StockOperations.SUBSTRACT) {
          await this.stockService.subtractProductStock(
            detail.product_id as unknown as string,
            quantity,
            user
          );
        }
      }
    }
  }

  async deletePurchase(id: string, user: string): Promise<void> {
    const purchase = await this.purchaseRepository.getPurchaseById(id);

    // Actualizamos el stock de los productos comprados
    this.updateDetailsStock(purchase!, StockOperations.SUBSTRACT, user);
    const result = await this.purchaseRepository.deletePurchase(id, user);
    return result;
  }

  async updatePurchase(purchase: IPurchaseDTO, user: string): Promise<void> {
    try {
      this.purchaseDomain = this.purchaseMapper.toDomain(purchase);
      const result = await this.purchaseRepository.updatePurchase(
        this.purchaseDomain,
        user
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
}
