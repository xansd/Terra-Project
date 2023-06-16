import { ProductsType } from "../../products/domain/products";
import { Email } from "../../shared/domain/value-objects/email.value-object";
import { IPersistenceMapper } from "../../shared/infraestructure/persistence-mapper.interface";
import { IProvider } from "../domain/providers";
import { ProviderID } from "../domain/value-objects/provider-id.value.object";

export interface IProvidersPersistence {
  provider_id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  type: ProductsType;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class ProvidersPersistenceMapper
  implements IPersistenceMapper<IProvider, IProvidersPersistence>
{
  constructor() {}
  toDomain(persistence: IProvidersPersistence): IProvider {
    return {
      provider_id: ProviderID.create(persistence.provider_id),
      name: persistence.name,
      email: Email.create(persistence.email!),
      phone: persistence.phone,
      address: persistence.address,
      type: persistence.type,
      user_created: persistence.user_created,
      user_updated: persistence.user_updated,
      created_at: persistence.created_at,
      updated_at: persistence.updated_at,
      deleted_at: persistence.deleted_at,
    };
  }
  toPersistence(domain: IProvider): IProvidersPersistence {
    const {
      provider_id,
      name,
      email,
      phone,
      address,
      type,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    } = domain;
    return {
      provider_id: provider_id.value,
      name: name,
      email: email?.value,
      phone: phone,
      address: address,
      type: type,
      user_created: user_created,
      user_updated: user_updated,
      created_at: created_at,
      updated_at: updated_at,
      deleted_at: deleted_at,
    };
  }
  toPersistenceList(domainList: IProvider[]): IProvidersPersistence[] {
    return domainList.map((provider) => this.toPersistence(provider));
  }
  toDomainList(persistenceList: IProvidersPersistence[]): IProvider[] {
    return persistenceList.map((providerPersistence) =>
      this.toDomain(providerPersistence)
    );
  }
}
