import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthToken } from 'src/app/auth/domain/token';
import { IProduct } from '../domain/products';
import { IProductAPIPort } from '../domain/products.repository';

export interface ICreateProductUseCase {
  createProduct(Product: IProduct): Observable<IProduct>;
}
@Injectable({
  providedIn: 'root',
})
export class CreateProductUseCase implements ICreateProductUseCase {
  constructor(
    @Inject('productsAPI') private readonly productsAPI: IProductAPIPort,
    @Inject('authToken') private authTokenService: IAuthToken
  ) {}
  createProduct(product: IProduct): Observable<IProduct> {
    return this.productsAPI.create(product);
  }

  getCreator(): string {
    return this.authTokenService.getUserID();
  }
}
