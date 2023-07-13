import {
  InvalidAmountError,
  MinZeroError,
} from "../../../partners/domain/partner.exceptions";
import { IHarvests } from "../../domain/harvests";
import Logger from "../../../../apps/utils/logger";
import { IPurchasesRepository } from "../../domain/purchases.repository";
import { StockOperations } from "../../../products/domain/products";
import { IProductRepository } from "../../../products/domain/products.repository";
import { UpdateStockService } from "../../../products/application/services/update-stock.service";

export class UpdateHarvestStockService {
  productStockService: UpdateStockService = new UpdateStockService(
    this.productRepository
  );
  constructor(
    private readonly harvestRepository: IPurchasesRepository,
    private readonly productRepository: IProductRepository
  ) {}
  createHarvestStock(harvest: IHarvests, user: string) {
    const stockValue = Number(harvest.quantity);
    if (isNaN(stockValue) || stockValue <= 0) {
      Logger.error(`createHarvestStock: InvalidAmountError: valor incorrecto`);
      throw new InvalidAmountError();
    }
    // Añadimos el stock al producto
    this.productStockService.addProductStock(
      harvest?.product_id!,
      stockValue,
      user
    );
    return stockValue;
  }

  async substractHarvestStock(
    harvestId: string,
    stockValue: number,
    user: string
  ): Promise<number> {
    let harvest = await this.harvestRepository.getHarvestById(harvestId);
    // Sustraemos el stock del producto
    await this.productStockService.subtractProductStock(
      harvest?.product_id!,
      stockValue,
      user
    );
    // Sustraemos el stock del cultivo
    const oldStock = Number(harvest!.stock);
    const subtractValue = Number(stockValue);
    if (isNaN(subtractValue) || subtractValue < 0) {
      Logger.error(
        `subtractProductStock: InvalidAmountError: valor incorrecto`
      );
      throw new InvalidAmountError();
    }
    let excedente = 0;
    let newStock = oldStock - subtractValue;
    if (isNaN(newStock)) throw new InvalidAmountError();
    if (newStock < 0) {
      // Añadimos excedente en caso de que el stock sea negativo !!
      // excedente = Math.abs(newStock);
      // this.validateLossOperation(
      //   harvestId,
      //   StockOperations.ADD_EXCEDENT,
      //   excedente
      // );
      // newStock = 0;
      // Logger.error(
      //   `substractHarvestStock : MinZeroError : valor inferior a cero`
      // );

      // Si no hay stock suficinete se lanza error
      Logger.error(
        `subtractProductStock : MinZeroError : valor inferior a cero`
      );
      throw new MinZeroError();
    }
    return newStock;
  }

  async addHarvestStock(
    harvestId: string,
    stockValue: number,
    user: string
  ): Promise<number> {
    let harvest = await this.harvestRepository.getHarvestById(harvestId);
    // añadimos el stock del producto
    await this.productStockService.addProductStock(
      harvest?.product_id!,
      stockValue,
      user
    );
    // añadimos el stock del cultivo
    const oldStock = Number(harvest!.stock);
    const addValue = Number(stockValue);
    if (isNaN(addValue) || addValue < 0) {
      Logger.error(`addHarvestStock: InvalidAmountError: valor incorrecto`);
      throw new InvalidAmountError();
    }
    let newStock = oldStock + addValue;
    if (isNaN(newStock)) throw new InvalidAmountError();
    return newStock;
  }

  validateUpdateHarvestStock(stock: number) {
    let update = Number(stock);
    if (isNaN(update)) {
      Logger.error(
        `validateUpdateHarvestStock : InvalidAmountError : valor incorrecto`
      );
      throw new InvalidAmountError();
    }
    if (update < 0) {
      Logger.error(
        `validateUpdateHarvestStock : MinZeroError : valor inferior a cero`
      );
      throw new MinZeroError();
    }
    return update;
  }

  async validateLossOperation(
    harvestId: string,
    operation: StockOperations,
    value: number
  ): Promise<number> {
    let result = 0;
    let valueToAdd = Number(value);

    // Si es UPDATE result es el valor recibido
    if (operation !== StockOperations.UPDATE_LOSS) {
      if (operation === StockOperations.ADD_LOSS) {
        if (valueToAdd > 0) valueToAdd *= -1;
      } else if (operation === StockOperations.ADD_EXCEDENT) {
        if (valueToAdd < 0) valueToAdd *= -1;
      }

      let harvest = await this.harvestRepository.getHarvestById(harvestId);
      const oldLoss = Number(harvest!.loss);
      if (oldLoss) {
        result = oldLoss + valueToAdd;
      }
    } else result = valueToAdd;

    if (isNaN(result)) throw new InvalidAmountError();
    return result;
  }

  async getProductId(harvestId: string): Promise<string> {
    const result: IHarvests | null =
      await this.harvestRepository.getHarvestById(harvestId);
    return result?.product_id!;
  }
}
