import Logger from "../../../../apps/utils/logger";
import { DomainValidationError } from "../../../shared/domain/domain-validation.exception";
import { IHarvests } from "../../domain/harvests";
import { IPurchasesRepository } from "../../domain/purchases.repository";
import { HarvestsMapper, IHarvestsDTO } from "../harvest-dto.mapper";

export interface IUpdateHarvests {
  createHarvest(harvests: IHarvestsDTO): Promise<IHarvests>;
  updateHarvests(harvests: IHarvestsDTO): Promise<void>;
  deleteHarvest(id: string): Promise<void>;
}

export class UpdateHarvests implements IUpdateHarvests {
  private harvestsMapper: HarvestsMapper = new HarvestsMapper();
  harvestsDomain!: IHarvests;

  constructor(private readonly harvestsRepository: IPurchasesRepository) {}

  async createHarvest(harvests: IHarvestsDTO): Promise<IHarvests> {
    this.harvestsDomain = this.harvestsMapper.toDomain(harvests);
    const harvestsRepository = await this.harvestsRepository.createHarvest(
      this.harvestsDomain
    );
    return harvestsRepository;
  }

  async updateHarvests(harvests: IHarvestsDTO): Promise<void> {
    try {
      this.harvestsDomain = this.harvestsMapper.toDomain(harvests);
      const result = await this.harvestsRepository.updateHarvest(
        this.harvestsDomain
      );
      return result;
    } catch (error) {
      if (error instanceof DomainValidationError) {
        Logger.error(
          `updateHarvests : DomainValidationError : domain validation error`
        );
        throw new DomainValidationError(error.message);
      }
      throw error;
    }
  }

  async deleteHarvest(id: string): Promise<void> {
    const result = await this.harvestsRepository.deleteHarvest(id);
    return result;
  }
}
