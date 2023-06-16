import SERVER from '../../config/server.config';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  IProduct,
  ISubcategories,
  ICategories,
  ProductsType,
} from '../domain/products';
import {
  IProductDTO,
  IProductSubsetDTO,
  ProductDTOMapper,
} from './products-dto.mapper';
import { IProductAPIPort } from '../domain/products.repository';

const API_URI = SERVER.API_URI;
@Injectable({ providedIn: 'root' })
export class ProductAPIRepository implements IProductAPIPort {
  private readonly productDTOMapper: ProductDTOMapper;
  constructor(private http: HttpClient) {
    this.productDTOMapper = new ProductDTOMapper();
  }

  getById(productId: string): Observable<IProduct> {
    return this.http
      .get<IProductDTO>(`${API_URI}/products/${productId}`, {
        withCredentials: true,
      })
      .pipe(
        map((product: IProductDTO) => this.productDTOMapper.toDomain(product))
      );
  }

  getAll(type: ProductsType): Observable<IProduct[]> {
    return this.http
      .get<IProductDTO[]>(`${API_URI}/products/all/${type}`, {
        withCredentials: true,
      })
      .pipe(
        map((productList: IProductDTO[]) =>
          this.productDTOMapper.toDomainList(productList)
        )
      );
  }

  getAllFiltered(type: ProductsType): Observable<IProductSubsetDTO[]> {
    return this.http.get<IProductSubsetDTO[]>(
      `${API_URI}/products//all/${type}/filtered`,
      {
        withCredentials: true,
      }
    );
  }

  create(product: IProduct): Observable<IProduct> {
    const productDTO = this.productDTOMapper.toDTO(product);
    return this.http.post<IProductDTO>(`${API_URI}/products`, productDTO, {
      withCredentials: true,
    });
  }

  update(product: IProduct): Observable<void> {
    const productDTO = this.productDTOMapper.toDTO(product);
    return this.http.put<void>(`${API_URI}/products`, productDTO, {
      withCredentials: true,
    });
  }

  delete(productId: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/products/${productId}`, {
      withCredentials: true,
    });
  }

  makeActive(productId: string): Observable<void> {
    return this.http.put<void>(`${API_URI}/products/block/${productId}`, {
      withCredentials: true,
    });
  }

  makeInactive(productId: string): Observable<void> {
    return this.http.put<void>(`${API_URI}/products/block/${productId}`, {
      withCredentials: true,
    });
  }

  createSubCategory(subcategory: ISubcategories): Observable<void> {
    return this.http.post<void>(
      `${API_URI}/products/details/subcategories`,
      subcategory,
      {
        withCredentials: true,
      }
    );
  }

  getAllSubCategories(): Observable<ISubcategories[]> {
    return this.http.get<ISubcategories[]>(
      `${API_URI}/products/details/subcategories`,
      {
        withCredentials: true,
      }
    );
  }

  getAllCategories(): Observable<ICategories[]> {
    return this.http.get<ICategories[]>(
      `${API_URI}/products/details/categories`,
      {
        withCredentials: true,
      }
    );
  }

  deleteSubCategory(subcategoryId: string): Observable<void> {
    return this.http.delete<void>(
      `${API_URI}/products/details/subcategories/${subcategoryId}`,
      {
        withCredentials: true,
      }
    );
  }

  enrollSubCategories(
    subcategoryIds: string[],
    productId: string
  ): Observable<void> {
    return this.http.put<void>(
      `${API_URI}/products/enroll/subcategories`,
      { subcategoryIds, productId },
      {
        withCredentials: true,
      }
    );
  }

  enrollAncestors(ancestorIds: string[], productId: string): Observable<void> {
    return this.http.put<void>(
      `${API_URI}/products/enroll/ancestors/`,
      { ancestorIds, productId },
      {
        withCredentials: true,
      }
    );
  }
}
