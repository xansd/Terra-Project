import Logger from "../../../../apps/utils/logger";
import { ICategories, IProduct, ISubcategories } from "../../domain/products";
import {
  CategoriesNotFoundError,
  ProductDoesNotExistError,
  SubcategoriesNotFoundError,
} from "../../domain/products.exception";
import { IProductRepository } from "../../domain/products.repository";
import { IProductSubsetDTO } from "../products-dto.mapper";

export interface IGetProduct {
  getProduct(id: string): Promise<IProduct>;
}

export interface IGetAllProducts {
  getAllProducts(type: string): Promise<IProduct[]>;
}

export interface IGetProductsFiltered {
  getAllProductsFiltered(type: string): Promise<IProductSubsetDTO[]>;
}

export interface IGetAllCategories {
  getAllCategories(): Promise<ICategories[]>;
}

export interface IGetAllSubcategories {
  getAllSubcategories(): Promise<ISubcategories[]>;
}

export class GetProductsUseCase
  implements
    IGetProduct,
    IGetAllProducts,
    IGetProductsFiltered,
    IGetAllCategories,
    IGetAllSubcategories
{
  constructor(private readonly productsRepository: IProductRepository) {}
  async getProduct(id: string): Promise<IProduct> {
    const product = await this.productsRepository.getById(id);
    if (!product) {
      Logger.error(
        `product-repository : getProduct : ${ProductDoesNotExistError}`
      );
      throw new ProductDoesNotExistError();
    }
    return product;
  }

  async getAllProducts(type: string): Promise<IProduct[]> {
    const products = await this.productsRepository.getAll(type);
    if (products.length === 0) {
      const productNotFound = new ProductDoesNotExistError();
      Logger.error(
        `product-repository : getAllProducts : ${ProductDoesNotExistError}`
      );
      throw productNotFound;
    }

    return products;
  }

  async getAllProductsFiltered(type: string): Promise<IProductSubsetDTO[]> {
    const products = await this.productsRepository.getAllFiltered(type);

    return products;
  }

  async getAllCategories(): Promise<ICategories[]> {
    const categories = await this.productsRepository.getAllCategories();
    if (categories.length === 0) {
      const categoriesNotFound = new CategoriesNotFoundError();
      Logger.error(
        `product-repository : getAllCategories : ${CategoriesNotFoundError}`
      );
      throw categoriesNotFound;
    }

    return categories;
  }

  async getAllSubcategories(): Promise<ISubcategories[]> {
    const subcategories = await this.productsRepository.getAllSubCategories();
    if (subcategories.length === 0) {
      const subcategoriesNotFound = new SubcategoriesNotFoundError();
      Logger.error(
        `product-repository : getAllSubcategories : ${SubcategoriesNotFoundError}`
      );
      throw subcategoriesNotFound;
    }

    return subcategories;
  }
}
