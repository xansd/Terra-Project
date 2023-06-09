import { Observable } from 'rxjs';
import { IProduct, ICategories, ISubcategories } from '../domain/products';
import { IProductAPIPort } from '../domain/products.repository';
import { IProductSubsetDTO } from '../infrastructure/products-dto.mapper';
import { Inject, Injectable } from '@angular/core';

export interface IGetProduct {
  getProduct(id: string): Observable<IProduct>;
}

export interface IGetAllProducts {
  getAllProducts(): Observable<IProduct[]>;
}

export interface IGetProductsFiltered {
  getAllProductsFiltered(): Observable<IProductSubsetDTO[]>;
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
  getAllProducts(): Observable<IProduct[]> {
    return this.productsAPI.getAll();
  }
  getAllProductsFiltered(): Observable<IProductSubsetDTO[]> {
    return this.productsAPI.getAllFiltered();
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
