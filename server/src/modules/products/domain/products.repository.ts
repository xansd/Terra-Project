import { IProductSubsetDTO } from "../application/products-dto.mapper";
import { ICategories, IProduct, ISubcategories } from "./products";

export interface IProductRepository {
  getById(productId: string): Promise<IProduct>;
  getAll(type: string): Promise<IProduct[]>;
  getAllFiltered(type: string): Promise<IProductSubsetDTO[]>;
  create(product: IProduct): Promise<IProduct>;
  update(product: IProduct): Promise<void>;
  delete(productId: string, user: string): Promise<void>;
  makeActive(productId: string, user: string): Promise<void>;
  makeInactive(productId: string, user: string): Promise<void>;
  checkProductExistenceByName(name: string): Promise<boolean>;
  getProductStock(productId: string): Promise<boolean>;
  updateProductStock(
    productId: string,
    stock: number,
    user: string
  ): Promise<void>;

  createSubCategory(subcategory: ISubcategories): Promise<void>;
  getAllSubCategories(): Promise<ISubcategories[]>;
  getAllCategories(): Promise<ICategories[]>;
  deleteSubCategory(subcategoryId: string): Promise<void>;
  enrollSubCategories(
    subcategoryIds: string[],
    productId: string
  ): Promise<void>;

  enrollAncestors(ancestroIds: string[], productId: string): Promise<void>;
}
