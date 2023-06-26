import Logger from "../../../../apps/utils/logger";
import { IProvider } from "../../domain/providers";
import {
  ProviderDoesNotExistError,
  ProvidersNotFoundError,
} from "../../domain/providers.exceptions";
import { IProviderRepository } from "../../domain/providers.repository";

export interface IGetProviders {
  getById(id: string): Promise<IProvider>;
  getAll(type: string): Promise<IProvider[]>;
}

export class GetProviders implements IGetProviders {
  constructor(private readonly providersRepository: IProviderRepository) {}
  async getById(id: string): Promise<IProvider> {
    const provider = await this.providersRepository.getById(id);
    if (!provider) {
      Logger.error(
        `provider-repository : getById : ${ProviderDoesNotExistError}`
      );
      throw new ProviderDoesNotExistError();
    }
    return provider;
  }

  async getAll(type: string): Promise<IProvider[]> {
    const providers = await this.providersRepository.getAll(type);
    if (providers.length === 0) {
      const providerNotFound = new ProvidersNotFoundError();
      Logger.error(`provider-repository : getAll : ${ProvidersNotFoundError}`);
      throw providerNotFound;
    }

    return providers;
  }
}
