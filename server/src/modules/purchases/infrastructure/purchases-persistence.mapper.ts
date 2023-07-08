import { IPersistenceMapper } from "../../shared/infraestructure/persistence-mapper.interface";
import { IPurchase, IPurchaseDetails } from "../domain/purchases";
import { PurchaseCode } from "../domain/value-objects/code-id.value-object";
import { PurchaseID } from "../domain/value-objects/purchase-id.value.object";

export interface IPurchasePersistence {
  purchase_id: string;
  code?: string;
  provider_id: string;
  provider_name?: string;
  total_amount?: number;
  purchase_details: IPurchaseDetails[];
  notes?: string;
  paid?: number;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class PurchasePersistenceMapper
  implements IPersistenceMapper<IPurchase, IPurchasePersistence>
{
  constructor() {}
  toDomain(persistence: IPurchasePersistence): IPurchase {
    return {
      purchase_id: PurchaseID.create(persistence.purchase_id),
      code: PurchaseCode.create(
        PurchaseID.create(persistence.purchase_id),
        persistence.code
      ),
      provider_id: persistence.provider_id,
      provider_name: persistence.provider_name,
      total_amount: persistence.total_amount,
      purchase_details: persistence.purchase_details,
      notes: persistence.notes,
      paid: persistence.paid,
      user_created: persistence.user_created,
      user_updated: persistence.user_updated,
      created_at: persistence.created_at,
      updated_at: persistence.updated_at,
      deleted_at: persistence.deleted_at,
    };
  }
  toPersistence(domain: IPurchase): IPurchasePersistence {
    const {
      purchase_id,
      code,
      provider_id,
      provider_name,
      total_amount,
      purchase_details,
      notes,
      paid,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    } = domain;
    return {
      purchase_id: purchase_id.value,
      code: code?.value,
      provider_id: provider_id,
      provider_name: provider_name,
      total_amount: total_amount,
      purchase_details: purchase_details,
      notes: notes,
      paid: paid,
      user_created: user_created,
      user_updated: user_updated,
      created_at: created_at,
      updated_at: updated_at,
      deleted_at: deleted_at,
    };
  }
  toPersistenceList(domainList: IPurchase[]): IPurchasePersistence[] {
    return domainList.map((provider) => this.toPersistence(provider));
  }
  toDomainList(persistenceList: IPurchasePersistence[]): IPurchase[] {
    return persistenceList.map((providerPersistence) =>
      this.toDomain(providerPersistence)
    );
  }
}
