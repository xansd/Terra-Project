import { IProvider } from "./providers";

export interface IProviderRepository {
  getById(providerId: string): Promise<IProvider>;
  getAll(type: string): Promise<IProvider[]>;
  create(provider: IProvider): Promise<IProvider>;
  update(provider: IProvider): Promise<void>;
  delete(providerId: string): Promise<void>;
  checkProviderExistenceByName(name: string): Promise<boolean>;
}
