import { Observable } from 'rxjs';
import { ISales } from './sales';

export interface ISalesRepository {
  getById(id: string): Observable<ISales>;
  getAll(): Observable<ISales[]>;
  getAllPartnerSales(id: string): Observable<ISales[]>;
  create(purchase: ISales): Observable<ISales>;
  delete(id: string): Observable<void>;
}
