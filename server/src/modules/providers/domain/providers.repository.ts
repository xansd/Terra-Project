import { IProvider } from "./providers";

export interface IProviderRepository {
  getById(providerId: string): Promise<IProvider>;
  getAll(type: string): Promise<IProvider[]>;
  create(provider: IProvider, user: string): Promise<IProvider>;
  update(provider: IProvider, user: string): Promise<void>;
  delete(providerId: string, user: string): Promise<void>;
  checkProviderExistenceByName(name: string): Promise<boolean>;
}
