import Logger from "../../../../apps/utils/logger";
import { IHarvests } from "../../domain/harvests";
import {
  HarvestDoesNotExistError,
  HarvestNotFoundError,
} from "../../domain/purchases.exception";
import { IPurchasesRepository } from "../../domain/purchases.repository";

export interface IGetHarvests {
  getHarvestById(id: string): Promise<IHarvests>;
  getAllHarvests(): Promise<IHarvests[]>;
}

export class GetHarvests implements IGetHarvests {
  constructor(private readonly harvestsRepository: IPurchasesRepository) {}
  async getHarvestById(id: string): Promise<IHarvests> {
    const harvest = await this.harvestsRepository.getHarvestById(id);
    if (!harvest) {
      Logger.error(
        `harvests-repository : getHarvestById : ${HarvestDoesNotExistError}`
      );
      throw new HarvestDoesNotExistError();
    }
    return harvest;
  }

  async getAllHarvests(): Promise<IHarvests[]> {
    const harvests = await this.harvestsRepository.getAllHarvests();
    if (harvests.length === 0) {
      const harvestsNotFound = new HarvestNotFoundError();
      Logger.error(
        `harvests-repository : getAllHarvests : ${HarvestNotFoundError}`
      );
      throw harvestsNotFound;
    }

    return harvests;
  }
}
