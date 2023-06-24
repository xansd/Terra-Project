import { Observable } from 'rxjs';
import { IProvider } from './providers';

export interface IProviderRepository {
  getById(providerId: string): Observable<IProvider>;
  getAll(type: string): Observable<IProvider[]>;
  create(provider: IProvider): Observable<IProvider>;
  update(provider: IProvider): Observable<void>;
  delete(providerId: string): Observable<void>;
}
