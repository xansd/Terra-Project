import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IProvider } from '../domain/providers';
import { IProviderRepository } from '../domain/providers.repository';

export interface IUpdateProviders {
  create(provider: IProvider): Observable<IProvider>;
  updateProvider(provider: IProvider): Observable<void>;
  delete(id: string): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class UpdateProviders implements IUpdateProviders {
  constructor(
    @Inject('providersAPI') private readonly providersAPI: IProviderRepository
  ) {}

  create(provider: IProvider): Observable<IProvider> {
    return this.providersAPI.create(provider);
  }

  updateProvider(provider: IProvider): Observable<void> {
    return this.providersAPI.update(provider);
  }

  delete(id: string): Observable<void> {
    return this.providersAPI.delete(id);
  }
}
