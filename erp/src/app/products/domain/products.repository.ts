import { Observable } from 'rxjs';
import { IProductSubsetDTO } from '../infrastructure/products-dto.mapper';
import { ICategories, IProduct, ISubcategories } from './products';

export interface IProductAPIPort {
  getById(productId: string): Observable<IProduct>;
  getAll(): Observable<IProduct[]>;
  getAllFiltered(): Observable<IProductSubsetDTO[]>;
  create(product: IProduct): Observable<IProduct>;
  update(product: IProduct): Observable<void>;
  delete(productId: string): Observable<void>;
  makeActive(productId: string): Observable<void>;
  makeInactive(productId: string): Observable<void>;

  createSubCategory(subcategory: ISubcategories): Observable<void>;
  getAllSubCategories(): Observable<ISubcategories[]>;
  getAllCategories(): Observable<ICategories[]>;
  deleteSubCategory(subcategoryId: string): Observable<void>;
  enrollSubCategories(
    subcategoryIds: string[],
    productId: string
  ): Observable<void>;

  enrollAncestors(ancestorIds: string[], productId: string): Observable<void>;
}
