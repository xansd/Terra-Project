import SERVER from '../../config/server.config';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IProvider } from '../domain/providers';
import { IProviderRepository } from '../domain/providers.repository';
import { ProviderMapper, IProviderDTO } from './provider-dto.mapper';

const API_URI = SERVER.API_URI;

@Injectable({ providedIn: 'root' })
export class ProvidersAPIRepository implements IProviderRepository {
  private readonly providerMapper: ProviderMapper;
  constructor(private http: HttpClient) {
    this.providerMapper = new ProviderMapper();
  }
  getById(providerId: string): Observable<IProvider> {
    return this.http
      .get<IProviderDTO>(`${API_URI}/providers/${providerId}`, {
        withCredentials: true,
      })
      .pipe(
        map((providers: IProviderDTO) =>
          this.providerMapper.toDomain(providers)
        )
      );
  }
  getAll(type: string): Observable<IProvider[]> {
    return this.http
      .get<IProviderDTO[]>(`${API_URI}/providers/all/type/${type}`, {
        withCredentials: true,
      })
      .pipe(
        map((ProvidersList: IProviderDTO[]) =>
          this.providerMapper.toDomainList(ProvidersList)
        )
      );
  }

  create(provider: IProvider): Observable<IProvider> {
    const providerDTO = this.providerMapper.toDTO(provider);
    return this.http.post<IProvider>(`${API_URI}/providers`, providerDTO, {
      withCredentials: true,
    });
  }

  update(provider: IProvider): Observable<void> {
    const productDTO = this.providerMapper.toDTO(provider);
    return this.http.put<void>(`${API_URI}/providers`, productDTO, {
      withCredentials: true,
    });
  }

  delete(providerId: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/providers/${providerId}`, {
      withCredentials: true,
    });
  }
}
