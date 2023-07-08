import { IPersistenceMapper } from "../../shared/infraestructure/persistence-mapper.interface";
import { IHarvests } from "../domain/harvests";
import { PurchaseCode } from "../domain/value-objects/code-id.value-object";
import { PurchaseID } from "../domain/value-objects/purchase-id.value.object";

export interface IHarvestsPersistence {
  harvest_id: string;
  code?: string;
  provider_id: string;
  product_id: string;
  provider_name?: string;
  product_name?: string;
  cost_price?: number;
  sale_price?: number;
  fee_amount?: number;
  quantity?: number;
  notes?: string;
  stock?: number;
  loss?: number;
  manicured?: number;
  paid?: number;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class HarvestsPersistenceMapper
  implements IPersistenceMapper<IHarvests, IHarvestsPersistence>
{
  constructor() {}
  toDomain(persistence: IHarvestsPersistence): IHarvests {
    return {
      harvest_id: PurchaseID.create(persistence.harvest_id),
      code: PurchaseCode.create(
        PurchaseID.create(persistence.harvest_id),
        persistence.code
      ),
      provider_id: persistence.provider_id,
      product_id: persistence.product_id,
      provider_name: persistence.provider_name,
      product_name: persistence.product_name,
      cost_price: persistence.cost_price,
      sale_price: persistence.sale_price,
      fee_amount: persistence.fee_amount,
      quantity: persistence.quantity,
      notes: persistence.notes,
      stock: persistence.stock,
      loss: persistence.loss,
      paid: persistence.paid,
      manicured: persistence.manicured,
      user_created: persistence.user_created,
      user_updated: persistence.user_updated,
      created_at: persistence.created_at,
      updated_at: persistence.updated_at,
      deleted_at: persistence.deleted_at,
    };
  }
  toPersistence(domain: IHarvests): IHarvestsPersistence {
    const {
      harvest_id,
      code,
      provider_id,
      product_id,
      product_name,
      provider_name,
      cost_price,
      sale_price,
      fee_amount,
      quantity,
      notes,
      stock,
      loss,
      manicured,
      paid,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    } = domain;
    return {
      harvest_id: harvest_id.value,
      code: code?.value,
      provider_id: provider_id,
      product_id: product_id,
      provider_name: provider_name,
      product_name: product_name,
      cost_price: cost_price,
      sale_price: sale_price,
      fee_amount: fee_amount,
      quantity: quantity,
      notes: notes,
      stock: stock,
      loss: loss,
      manicured: manicured,
      paid: paid,
      user_created: user_created,
      user_updated: user_updated,
      created_at: created_at,
      updated_at: updated_at,
      deleted_at: deleted_at,
    };
  }
  toPersistenceList(domainList: IHarvests[]): IHarvestsPersistence[] {
    return domainList.map((harvest) => this.toPersistence(harvest));
  }
  toDomainList(persistenceList: IHarvestsPersistence[]): IHarvests[] {
    return persistenceList.map((harvestPersistence) =>
      this.toDomain(harvestPersistence)
    );
  }
}
