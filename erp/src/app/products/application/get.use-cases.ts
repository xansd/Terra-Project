import { Observable } from 'rxjs';
import {
  IProduct,
  ICategories,
  ISubcategories,
  ProductsType,
} from '../domain/products';
import { IProductAPIPort } from '../domain/products.repository';
import { IProductSubsetDTO } from '../infrastructure/products-dto.mapper';
import { Inject, Injectable } from '@angular/core';

export interface IGetProduct {
  getProduct(id: string): Observable<IProduct>;
}

export interface IGetAllProducts {
  getAllProducts(type: ProductsType): Observable<IProduct[]>;
}

export interface IGetProductsFiltered {
  getAllProductsFiltered(type: ProductsType): Observable<IProductSubsetDTO[]>;
}

export interface IGetAllCategories {
  getAllCategories(): Observable<ICategories[]>;
}

export interface IGetAllSubcategories {
  getAllSubcategories(): Observable<ISubcategories[]>;
}

@Injectable({
  providedIn: 'root',
})
export class GetProductsUseCase
  implements
    IGetProduct,
    IGetAllProducts,
    IGetProductsFiltered,
    IGetAllCategories,
    IGetAllSubcategories
{
  constructor(
    @Inject('productsAPI') private readonly productsAPI: IProductAPIPort
  ) {}
  getAllProducts(type: ProductsType): Observable<IProduct[]> {
    return this.productsAPI.getAll(type);
  }
  getAllProductsFiltered(type: ProductsType): Observable<IProductSubsetDTO[]> {
    return this.productsAPI.getAllFiltered(type);
  }
  getAllCategories(): Observable<ICategories[]> {
    return this.productsAPI.getAllCategories();
  }
  getAllSubcategories(): Observable<ISubcategories[]> {
    return this.productsAPI.getAllSubCategories();
  }
  getProduct(id: string): Observable<IProduct> {
    return this.productsAPI.getById(id);
  }
}
