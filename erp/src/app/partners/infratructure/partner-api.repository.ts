import { Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import SERVER from '../../config/server.config';
import { IPartnerAPIPort } from '../domain/partner-api.port';
import { PartnerDTOMapper } from './partner-dto.mapper';
import { IPartnerDTO } from './partner.dto';
import { IPartner, IPartnersType } from '../domain/partner';

const API_URI = SERVER.API_URI + '/partners';

@Injectable({ providedIn: 'root' })
export class PartnerAPIRepository implements IPartnerAPIPort {
  private readonly partnerDTOMapper: PartnerDTOMapper;

  constructor(private http: HttpClient) {
    this.partnerDTOMapper = new PartnerDTOMapper();
  }

  getPartnerLastNumber(): Observable<object> {
    return this.http.get<object>(`${API_URI}/details/number`, {
      withCredentials: true,
    });
  }

  getPartner(partnerId: string): Observable<IPartner> {
    return this.http
      .get<IPartnerDTO>(`${API_URI}/${partnerId}`, {
        withCredentials: true,
      })
      .pipe(
        map((partner: IPartnerDTO) => this.partnerDTOMapper.toDomain(partner))
      );
  }

  getAllPartners(): Observable<IPartner[]> {
    return this.http
      .get<IPartnerDTO[]>(`${API_URI}`, {
        withCredentials: true,
      })
      .pipe(
        map((partnersList: IPartnerDTO[]) =>
          this.partnerDTOMapper.toDomainList(partnersList)
        )
      );
  }

  getPartnersType(): Observable<IPartnersType[]> {
    return this.http.get<IPartnersType[]>(`${API_URI}/details/types`, {
      withCredentials: true,
    });
  }

  createPartner(partner: IPartner): Observable<void> {
    return this.http.post<void>(`${API_URI}`, partner, {
      withCredentials: true,
    });
  }

  updatePartner(partner: IPartner): Observable<void> {
    return this.http.put<void>(`${API_URI}`, partner, {
      withCredentials: true,
    });
  }

  deletePartner(partnerId: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/${partnerId}`, {
      withCredentials: true,
    });
  }

  makeActive(partnerId: string): Observable<void> {
    return this.http.put<void>(`${API_URI}/activate/${partnerId}`, {
      withCredentials: true,
    });
  }

  makeInactive(partnerId: string): Observable<void> {
    return this.http.put<void>(`${API_URI}/block/${partnerId}`, {
      withCredentials: true,
    });
  }
}
