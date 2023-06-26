import { IPersistenceMapper } from "../../shared/infraestructure/persistence-mapper.interface";
import { ISales, ISalesDetails } from "../domain/sales";
import { SalesCode } from "../domain/value-objects/code-id.value-object";
import { SalesID } from "../domain/value-objects/sales-id.value.object";

export interface ISalesPersistence {
  sale_id: string;
  code?: string;
  partner_id: string;
  discount?: number;
  tax?: number;
  total_amount: number;
  sale_details: ISalesDetails[];
  notes?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class SalesPersistenceMapper
  implements IPersistenceMapper<ISales, ISalesPersistence>
{
  constructor() {}
  toDomain(persistence: ISalesPersistence): ISales {
    return {
      sale_id: SalesID.create(persistence.sale_id),
      code: SalesCode.create(
        SalesID.create(persistence.sale_id),
        persistence.code
      ),
      partner_id: persistence.partner_id,
      discount: persistence.discount,
      tax: persistence.tax,
      total_amount: persistence.total_amount,
      sale_details: persistence.sale_details,
      notes: persistence.notes,
      user_created: persistence.user_created,
      user_updated: persistence.user_updated,
      created_at: persistence.created_at,
      updated_at: persistence.updated_at,
      deleted_at: persistence.deleted_at,
    };
  }
  toPersistence(domain: ISales): ISalesPersistence {
    const {
      sale_id,
      code,
      partner_id,
      discount,
      tax,
      total_amount,
      sale_details,
      notes,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    } = domain;
    return {
      sale_id: sale_id.value,
      code: code?.value,
      partner_id: partner_id,
      discount: discount,
      tax: tax,
      total_amount: total_amount,
      sale_details: sale_details,
      notes: notes,
      user_created: user_created,
      user_updated: user_updated,
      created_at: created_at,
      updated_at: updated_at,
      deleted_at: deleted_at,
    };
  }
  toPersistenceList(domainList: ISales[]): ISalesPersistence[] {
    return domainList.map((sale) => this.toPersistence(sale));
  }
  toDomainList(persistenceList: ISalesPersistence[]): ISales[] {
    return persistenceList.map((salePersistence) =>
      this.toDomain(salePersistence)
    );
  }
}
