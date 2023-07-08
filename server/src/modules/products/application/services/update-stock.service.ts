import Logger from "../../../../apps/utils/logger";
import {
  InvalidAmountError,
  MinZeroError,
} from "../../../partners/domain/partner.exceptions";
import { IProductRepository } from "../../domain/products.repository";

export class UpdateStockService {
  constructor(private readonly productRepository: IProductRepository) {}
  async addProductStock(
    productId: string,
    value: number,
    user: string
  ): Promise<void> {
    const addValue = Number(value);
    if (isNaN(addValue) || addValue < 0) {
      Logger.error(`addProductStock: InvalidAmountError: valor incorrecto`);
      throw new InvalidAmountError();
    }

    const product = await this.productRepository.getById(productId);
    const oldStock = Number(product.stock);

    const newStock = oldStock + addValue;
    if (isNaN(newStock)) {
      Logger.error(`addProductStock: InvalidAmountError: valor incorrecto`);
      throw new InvalidAmountError();
    }

    await this.productRepository.updateProductStock(productId, newStock, user);
  }

  async subtractProductStock(
    productId: string,
    value: number,
    user: string
  ): Promise<void> {
    const subtractValue = Number(value);
    if (isNaN(subtractValue) || subtractValue < 0) {
      Logger.error(
        `subtractProductStock: InvalidAmountError: valor incorrecto`
      );
      throw new InvalidAmountError();
    }

    const product = await this.productRepository.getById(productId);
    const oldStock = Number(product.stock);

    let newStock = oldStock - subtractValue;
    if (isNaN(newStock)) {
      Logger.error(
        `subtractProductStock: InvalidAmountError: valor incorrecto`
      );
      throw new InvalidAmountError();
    }
    if (newStock < 0) {
      newStock = 0;
      Logger.error(
        `subtractProductStock : MinZeroError : valor inferior a cero`
      );
      throw new MinZeroError();
    }
    await this.productRepository.updateProductStock(productId, newStock, user);
  }

  validateUpdateProductStock(stock: number) {
    let update = Number(stock);
    if (isNaN(update)) {
      Logger.error(
        `updateHarvestStock : InvalidAmountError : valor incorrecto`
      );
      throw new InvalidAmountError();
    }
    if (update < 0) {
      Logger.error(`updateHarvestStock : MinZeroError : valor inferior a cero`);
      throw new MinZeroError();
    }
    return update;
  }
}
