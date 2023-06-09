import { IPersistenceMapper } from "../../shared/infraestructure/persistence-mapper.interface";
import { IProduct, ProductsType } from "../domain/products";
import { ProductCode } from "../domain/value-objects/code-id.value-object";
import { ProductID } from "../domain/value-objects/product-id.value.object";

export interface IProductPersistence {
  product_id?: string;
  code?: string;
  name: string;
  type: ProductsType;
  category_id: string;
  subcategories: string[];
  description?: string;
  cost_price?: number;
  sale_price?: number;
  ancestors?: string[];
  sativa?: number;
  indica?: number;
  thc?: number;
  cbd?: number;
  bank?: string;
  flawour?: string;
  effect?: string;
  stock?: number;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IProductPersistenceSubset {
  product_id: string;
  code: string;
  name: string;
}

export class ProductPersistenceMapper
  implements IPersistenceMapper<IProduct, IProductPersistence>
{
  constructor() {}
  toDomain(persistence: IProductPersistence): IProduct {
    return {
      product_id: ProductID.create(persistence.product_id),
      code: ProductCode.create(
        ProductID.create(persistence.product_id),
        persistence.code
      ),
      name: persistence.name,
      type: persistence.type,
      category_id: persistence.category_id,
      subcategories: persistence.subcategories,
      description: persistence.description,
      cost_price: persistence.cost_price,
      sale_price: persistence.sale_price,
      ancestors: persistence.ancestors,
      sativa: persistence.sativa,
      indica: persistence.indica,
      thc: persistence.thc,
      cbd: persistence.cbd,
      bank: persistence.bank,
      flawour: persistence.flawour,
      effect: persistence.effect,
      stock: persistence.stock,
      user_created: persistence.user_created,
      user_updated: persistence.user_updated,
      created_at: persistence.created_at,
      updated_at: persistence.updated_at,
      deleted_at: persistence.deleted_at,
    };
  }
  toPersistence(domain: IProduct): IProductPersistence {
    const {
      product_id,
      code,
      name,
      type,
      category_id,
      subcategories,
      description,
      cost_price,
      sale_price,
      ancestors,
      sativa,
      indica,
      thc,
      cbd,
      bank,
      flawour,
      effect,
      stock,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    } = domain;
    return {
      product_id: product_id!.value,
      code: code!.value,
      name: name,
      type: type,
      category_id: category_id,
      subcategories: subcategories,
      description: description,
      cost_price: cost_price,
      sale_price: sale_price,
      ancestors: ancestors,
      sativa: sativa,
      indica: indica,
      thc: thc,
      cbd: cbd,
      bank: bank,
      flawour: flawour,
      effect: effect,
      stock: stock!,
      user_created: user_created,
      user_updated: user_updated,
      created_at: created_at,
      updated_at: updated_at,
      deleted_at: deleted_at,
    };
  }
  toPersistenceList(domainList: IProduct[]): IProductPersistence[] {
    return domainList.map((product) => this.toPersistence(product));
  }
  toDomainList(persistenceList: IProductPersistence[]): IProduct[] {
    return persistenceList.map((productPersistence) =>
      this.toDomain(productPersistence)
    );
  }

  toDtoFilteredList(
    persistenceList: IProductPersistenceSubset[]
  ): IProductPersistenceSubset[] {
    return persistenceList.map((partner) => {
      return {
        product_id: partner.product_id,
        code: partner.code,
        name: partner.name,
      };
    });
  }
}
