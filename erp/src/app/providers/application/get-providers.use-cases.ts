import { Observable } from 'rxjs';
import { IProvider } from '../domain/providers';
import { IProviderRepository } from '../domain/providers.repository';
import { Injectable, Inject } from '@angular/core';

export interface IGetProviders {
  getById(id: string): Observable<IProvider>;
  getAll(type: string): Observable<IProvider[]>;
}
@Injectable({
  providedIn: 'root',
})
export class GetProviders implements IGetProviders {
  constructor(
    @Inject('providersAPI') private readonly providersAPI: IProviderRepository
  ) {}
  getById(id: string): Observable<IProvider> {
    return this.providersAPI.getById(id);
  }

  getAll(type: string): Observable<IProvider[]> {
    return this.providersAPI.getAll(type);
  }
}
