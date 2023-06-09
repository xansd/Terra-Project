import { Inject, Injectable } from '@angular/core';
import { IProductAPIPort } from '../domain/products.repository';
import { Observable } from 'rxjs';

export interface IDeleteProduct {
  deleteProduct(id: string): Observable<void>;
}

export interface IDeleteSubcategorie {
  deleteSubcategory(id: string): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class DeleteProductUseCase
  implements IDeleteProduct, IDeleteSubcategorie
{
  constructor(
    @Inject('productsAPI') private readonly productsAPI: IProductAPIPort
  ) {}

  deleteProduct(id: string): Observable<void> {
    return this.productsAPI.delete(id);
  }

  deleteSubcategory(id: string): Observable<void> {
    return this.productsAPI.deleteSubCategory(id);
  }
}
