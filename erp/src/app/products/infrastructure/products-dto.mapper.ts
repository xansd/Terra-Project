import { IDTOMapper } from '../../shared/application/dto-mapper.interface';
import { IProduct, Product, ProductsType } from '../domain/products';

export interface IProductDTO {
  product_id?: string;
  code?: string;
  active: boolean | number;
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

export interface IProductSubsetDTO {
  product_id: string;
  code: string;
  name: string;
}

export class ProductDTOMapper implements IDTOMapper<IProduct, IProductDTO> {
  constructor() {}
  toDomain(dto: IProductDTO): IProduct {
    const product_id = dto.product_id;
    const code = dto.code;
    const active = dto.active;
    const name = dto.name;
    const type = dto.type;
    const category_id = dto.category_id;
    const subcategories = dto.subcategories;
    const description = dto.description;
    const cost_price = dto.cost_price;
    const sale_price = dto.sale_price;
    const ancestors = dto.ancestors;
    const sativa = dto.sativa;
    const indica = dto.indica;
    const thc = dto.thc;
    const cbd = dto.cbd;
    const bank = dto.bank;
    const flawour = dto.flawour;
    const effect = dto.effect;
    const stock = dto.stock;
    const user_created = dto.user_created;
    const user_updated = dto.user_updated;
    const created_at = dto.created_at;
    const updated_at = dto.updated_at;
    const deleted_at = dto.deleted_at;
    const props = {
      product_id,
      code,
      active,
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
    };
    return Product.create(props);
  }

  toDTO(domain: IProduct): IProductDTO {
    return {
      product_id: domain.product_id,
      code: domain.code,
      active: domain.active,
      name: domain.name,
      type: domain.type,
      category_id: domain.category_id,
      subcategories: domain.subcategories,
      description: domain.description,
      cost_price: domain.cost_price,
      sale_price: domain.sale_price,
      ancestors: domain.ancestors,
      sativa: domain.sativa,
      indica: domain.indica,
      thc: domain.thc,
      cbd: domain.cbd,
      bank: domain.bank,
      flawour: domain.flawour,
      effect: domain.effect,
      stock: domain.stock,
      user_created: domain.user_created,
      user_updated: domain.user_updated,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }
  toDTOList(domainList: IProduct[]): IProductDTO[] {
    return domainList.map((product) => this.toDTO(product));
  }
  toDomainList(dtoList: IProductDTO[]): IProduct[] {
    return dtoList.map((productDTO) => this.toDomain(productDTO));
  }

  toDTOFiltered(domain: IProduct): IProductSubsetDTO {
    return {
      product_id: domain.product_id!,
      code: domain.code!,
      name: domain.name,
    };
  }

  toDTOFilteredList(domainList: IProduct[]): IProductSubsetDTO[] {
    return domainList.map((product) => {
      return {
        product_id: product.product_id!,
        code: product.code!,
        name: product.name,
      };
    });
  }
}
