import Logger from "../../../../apps/utils/logger";
import { DomainValidationError } from "../../../shared/domain/domain-validation.exception";
import { IProvider } from "../../domain/providers";
import { ProviderAlreadyExistsError } from "../../domain/providers.exceptions";
import { IProviderRepository } from "../../domain/providers.repository";
import { IProviderDTO, ProviderMapper } from "../provider-dto.mapper";

export interface IUpdateProviders {
  create(provider: IProviderDTO): Promise<IProvider>;
  updateProvider(provider: IProviderDTO): Promise<void>;
  delete(id: string): Promise<void>;
}

export class UpdateProviders implements IUpdateProviders {
  private providerMapper: ProviderMapper = new ProviderMapper();
  providerDomain!: IProvider;

  constructor(private readonly providersRepository: IProviderRepository) {}

  async create(provider: IProviderDTO): Promise<IProvider> {
    this.providerDomain = this.providerMapper.toDomain(provider);
    const providerRepository = await this.providersRepository.create(
      this.providerDomain
    );
    return providerRepository;
  }

  async updateProvider(provider: IProviderDTO): Promise<void> {
    try {
      this.providerDomain = this.providerMapper.toDomain(provider);
      // Comprobamos si ya exsite el nombre de proveedor
      const providerExists = await this.providersRepository.getById(
        provider.provider_id
      );
      const originalName = providerExists.name!.toLowerCase();
      // Verificar si el nombre ha cambiado
      if (provider.name!.toLowerCase() !== originalName) {
        // Realizar la consulta para verificar duplicados
        const isNameDuplicate =
          await this.providersRepository.checkProviderExistenceByName(
            provider.name!
          );

        if (isNameDuplicate) {
          Logger.error(
            `UpdateproviderUseCase : ProviderAlreadyExistsError : ${this
              .providerDomain.name!}`
          );
          throw new ProviderAlreadyExistsError(this.providerDomain.name!);
        }
      }

      const result = await this.providersRepository.update(this.providerDomain);
      return result;
    } catch (error) {
      if (error instanceof DomainValidationError) {
        Logger.error(
          `updateProvider : DomainValidationError : domain validation error`
        );
        throw new DomainValidationError(error.message);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.providersRepository.delete(id);
    return result;
  }
}
