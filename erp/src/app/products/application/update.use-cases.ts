import { Observable } from 'rxjs';
import { IProductAPIPort } from '../domain/products.repository';
import { IProductDTO } from '../infrastructure/products-dto.mapper';
import { Inject, Injectable } from '@angular/core';
import { IAuthToken } from 'src/app/auth/domain/token';

export interface IUpdateProductUseCase {
  updateProduct(product: IProductDTO): Observable<void>;
}

export interface IEnrollSubcategoiresUseCase {
  enrollSubcategories(
    subcategoryIds: string[],
    productId: string
  ): Observable<void>;
}

export interface IEnrollAncestorsUseCase {
  enrollAncestor(ancestorIds: string[], productId: string): Observable<void>;
}

export interface IMakeActive {
  makeActive(id: string): Observable<void>;
}

export interface IMakeInactive {
  makeInactive(id: string): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class UpdateProductUseCase
  implements
    IUpdateProductUseCase,
    IEnrollSubcategoiresUseCase,
    IEnrollAncestorsUseCase,
    IMakeActive,
    IMakeInactive
{
  constructor(
    @Inject('productsAPI') private readonly productsAPI: IProductAPIPort,
    @Inject('authToken') private authTokenService: IAuthToken
  ) {}

  updateProduct(product: IProductDTO): Observable<void> {
    return this.productsAPI.update(product);
  }
  enrollSubcategories(
    subcategoryIds: string[],
    productId: string
  ): Observable<void> {
    return this.productsAPI.enrollSubCategories(subcategoryIds, productId);
  }
  enrollAncestor(ancestorIds: string[], productId: string): Observable<void> {
    return this.productsAPI.enrollAncestors(ancestorIds, productId);
  }
  makeActive(id: string): Observable<void> {
    return this.productsAPI.makeActive(id);
  }
  makeInactive(id: string): Observable<void> {
    return this.productsAPI.makeInactive(id);
  }
}
