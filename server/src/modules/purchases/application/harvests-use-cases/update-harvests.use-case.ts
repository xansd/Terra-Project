import Logger from "../../../../apps/utils/logger";
import { InvalidAmountError } from "../../../partners/domain/partner.exceptions";
import { StockOperations } from "../../../products/domain/products";
import { IProductRepository } from "../../../products/domain/products.repository";
import { IHarvests } from "../../domain/harvests";
import { IPurchasesRepository } from "../../domain/purchases.repository";
import { HarvestsMapper, IHarvestsDTO } from "../harvest-dto.mapper";
import { UpdateHarvestStockService } from "../services/update-stock.service";

export interface IUpdateHarvests {
  createHarvest(harvests: IHarvestsDTO, user: string): Promise<IHarvests>;
  updateHarvestStock(
    harvestId: string,
    stock: number,
    operation: StockOperations,
    user: string
  ): Promise<void>;
  deleteHarvest(id: string, user: string): Promise<void>;
  updateHarvestManicured(
    harvestId: string,
    manicured: number,
    user: string
  ): Promise<void>;
}

export class UpdateHarvests implements IUpdateHarvests {
  private stockService = new UpdateHarvestStockService(
    this.harvestsRepository,
    this.productRepository
  );
  private harvestsMapper: HarvestsMapper = new HarvestsMapper();
  harvestsDomain!: IHarvests;

  constructor(
    private readonly harvestsRepository: IPurchasesRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async createHarvest(
    harvests: IHarvestsDTO,
    user: string
  ): Promise<IHarvests> {
    this.harvestsDomain = this.harvestsMapper.toDomain(harvests);
    const stock = this.stockService.createHarvestStock(
      this.harvestsDomain,
      user
    );
    this.harvestsDomain.stock = stock;
    const harvestsRepository = await this.harvestsRepository.createHarvest(
      this.harvestsDomain,
      user
    );
    return harvestsRepository;
  }

  async updateHarvestStock(
    harvestId: string,
    stock: number,
    operation: StockOperations,
    user: string
  ): Promise<void> {
    let newStockValue = 0;
    let oldStockValue = 0;

    switch (operation) {
      case StockOperations.SUBSTRACT:
        newStockValue = await this.stockService.substractHarvestStock(
          harvestId,
          stock,
          user
        );
        break;
      case StockOperations.UPDATE:
        newStockValue = this.stockService.validateUpdateHarvestStock(stock);
        if (isNaN(newStockValue)) {
          throw new InvalidAmountError();
        }
        if (newStockValue < 0) newStockValue = 0;
        const harvest = await this.harvestsRepository.getHarvestById(harvestId);
        oldStockValue = Number(harvest?.stock);
        if (!oldStockValue || isNaN(oldStockValue)) {
          oldStockValue = 0;
        }
        //Actualizamos el stock segun los valores antiguo/actual
        await this.stockService.addHarvestStock(
          harvestId,
          Math.abs(newStockValue),
          user
        );
        await this.stockService.substractHarvestStock(
          harvestId,
          Math.abs(oldStockValue),
          user
        );
        break;
    }
    const result = await this.harvestsRepository.updateHarvestStock(
      harvestId,
      stock,
      user
    );
    return result;
  }

  async updateHarvestLoss(
    harvestId: string,
    loss: number,
    operation: StockOperations,
    user: string
  ): Promise<void> {
    let newLossValue = 0;
    let oldLossValue = 0;

    newLossValue = await this.stockService.validateLossOperation(
      harvestId,
      operation,
      loss
    );

    if (isNaN(newLossValue)) {
      throw new InvalidAmountError();
    }

    const harvest = await this.harvestsRepository.getHarvestById(harvestId);
    oldLossValue = Number(harvest?.loss) || 0;

    if (oldLossValue !== newLossValue) {
      if (oldLossValue < 0) {
        await this.stockService.addHarvestStock(
          harvestId,
          Math.abs(oldLossValue),
          user
        );
      } else if (oldLossValue > 0) {
        await this.stockService.substractHarvestStock(
          harvestId,
          oldLossValue,
          user
        );
      }

      if (newLossValue < 0) {
        await this.stockService.substractHarvestStock(
          harvestId,
          Math.abs(newLossValue),
          user
        );
      } else if (newLossValue > 0) {
        await this.stockService.addHarvestStock(harvestId, newLossValue, user);
      }
    }

    const result = await this.harvestsRepository.updateHarvestLoss(
      harvestId,
      newLossValue,
      user
    );

    return result;
  }

  async updateHarvestManicured(
    harvestId: string,
    manicured: number,
    user: string
  ): Promise<void> {
    let oldManicuredValue = 0;
    let newManicuredValue = 0;
    newManicuredValue = Number(manicured) * -1;
    if (isNaN(newManicuredValue)) {
      throw new InvalidAmountError();
    }
    if (newManicuredValue > 0) newManicuredValue = 0;
    const harvest = await this.harvestsRepository.getHarvestById(harvestId);
    oldManicuredValue = Number(harvest?.manicured);
    if (!oldManicuredValue || isNaN(oldManicuredValue)) {
      oldManicuredValue = 0;
    }
    //Actualizamos el stock segun los valores antiguo/actual de manicurado
    await this.stockService.addHarvestStock(
      harvestId,
      Math.abs(oldManicuredValue),
      user
    );
    await this.stockService.substractHarvestStock(
      harvestId,
      Math.abs(newManicuredValue),
      user
    );

    const result = await this.harvestsRepository.updateHarvestManicured(
      harvestId,
      newManicuredValue,
      user
    );
    return result;
  }

  async updateHarvestFee(
    harvestId: string,
    fee: number,
    user: string
  ): Promise<void> {
    let newFee = 0;
    newFee = Number(fee);
    if (isNaN(newFee)) {
      throw new InvalidAmountError();
    }
    if (newFee < 0) newFee = 0;
    const result = await this.harvestsRepository.updateHarvestFee(
      harvestId,
      newFee,
      user
    );
    return result;
  }

  async deleteHarvest(id: string, user: string): Promise<void> {
    let quantity = 0;
    const harvest = await this.harvestsRepository.getHarvestById(id);
    quantity = harvest?.stock!;
    if (isNaN(quantity)) {
      Logger.error(`deleteHarvest: InvalidAmountError: valor incorrecto`);
      throw new InvalidAmountError();
    }
    await this.stockService.substractHarvestStock(id, quantity, user);
    return await this.harvestsRepository.deleteHarvest(id, user);
  }
}
