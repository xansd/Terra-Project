import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import SERVER from '../../config/server.config';
import { IPartnerAPIPort } from '../domain/partner-api.port';
import { PartnerDTOMapper } from './partner-dto.mapper';
import { IPartnerDTO } from './partner.dto';
import { IPartner, Partner } from '../domain/partner';

const API_URI = SERVER.API_URI + '/users';

@Injectable({ providedIn: 'root' })
export class PartnerAPIRepository implements IPartnerAPIPort {
  private readonly partnerDTOMapper: PartnerDTOMapper;

  constructor(private http: HttpClient) {
    this.partnerDTOMapper = new PartnerDTOMapper();
  }
  getPartner(partnerId: string): Observable<IPartner> {
    return this.http
      .get<IPartner>(`${API_URI}/${partnerId}`, {
        withCredentials: true,
      })
      .pipe(
        map((partner: IPartnerDTO) => this.partnerDTOMapper.toDomain(partner))
      );
  }

  getAllPartners(): Observable<IPartner[]> {
    return this.http
      .get<IPartner[]>(`${API_URI}`, {
        withCredentials: true,
      })
      .pipe(
        map((partner: IPartnerDTO[]) =>
          this.partnerDTOMapper.toDomainList(partner)
        )
      );
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

  uploadPartnerDocument(partnerId: string, file: File): Observable<void> {
    throw new Error('Method not implemented.');
  }

  getPartnerDocument(partnerId: string): Observable<File> {
    throw new Error('Method not implemented.');
  }

  getAllPartnerDocuments(partnerId: string): Observable<File[]> {
    throw new Error('Method not implemented.');
  }

  deletePartnerDocument(documentId: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
