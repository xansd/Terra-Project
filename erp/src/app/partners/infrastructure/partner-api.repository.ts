import { Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import SERVER from '../../config/server.config';
import { IPartnerAPIPort } from '../domain/partner-api.port';
import { IPartnerDTO, PartnerDTOMapper } from './partner-dto.mapper';
import {
  DocumentTypes,
  IOperationPartnerCash,
  IPartner,
  IPartnersType,
} from '../domain/partner';
import { IFees, IFeesType } from '../domain/fees';
import { FeesDTOMapper, IFeesDTO } from './fees-dto.mapper';
import { ISanctions } from '../domain/sanctions';

const API_URI = SERVER.API_URI;

@Injectable({ providedIn: 'root' })
export class PartnerAPIRepository implements IPartnerAPIPort {
  private readonly partnerDTOMapper: PartnerDTOMapper;
  private readonly feesDTOMapper: FeesDTOMapper;

  constructor(private http: HttpClient) {
    this.partnerDTOMapper = new PartnerDTOMapper();
    this.feesDTOMapper = new FeesDTOMapper();
  }

  getPartnerLastNumber(): Observable<object> {
    return this.http.get<object>(`${API_URI}/partners/details/number`, {
      withCredentials: true,
    });
  }

  getPartner(partnerId: string): Observable<IPartner> {
    return this.http
      .get<IPartnerDTO>(`${API_URI}/partners/${partnerId}`, {
        withCredentials: true,
      })
      .pipe(
        map((partner: IPartnerDTO) => this.partnerDTOMapper.toDomain(partner))
      );
  }

  getAllPartners(): Observable<IPartner[]> {
    return this.http
      .get<IPartnerDTO[]>(`${API_URI}/partners`, {
        withCredentials: true,
      })
      .pipe(
        map((partnersList: IPartnerDTO[]) =>
          this.partnerDTOMapper.toDomainList(partnersList)
        )
      );
  }

  getAllPartnersFiltered(): Observable<Partial<IPartner[]>> {
    return this.http.get<Partial<IPartner[]>>(
      `${API_URI}/partners/all/filtered`,
      {
        withCredentials: true,
      }
    );
  }

  getPartnersType(): Observable<IPartnersType[]> {
    return this.http.get<IPartnersType[]>(`${API_URI}/partners/details/types`, {
      withCredentials: true,
    });
  }

  createPartner(partner: IPartner): Observable<IPartner> {
    const partnerDTO = this.partnerDTOMapper.toDTO(partner);
    return this.http
      .post<IPartnerDTO>(`${API_URI}/partners`, partnerDTO, {
        withCredentials: true,
      })
      .pipe(
        map((partner: IPartnerDTO) => this.partnerDTOMapper.toDomain(partner))
      );
  }

  updatePartner(partner: IPartner): Observable<void> {
    const partnerDTO = this.partnerDTOMapper.toDTO(partner);
    return this.http.put<void>(`${API_URI}/partners`, partnerDTO, {
      withCredentials: true,
    });
  }

  deletePartner(partnerId: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/partners/${partnerId}`, {
      withCredentials: true,
    });
  }

  makeActive(partnerId: string): Observable<void> {
    return this.http.put<void>(`${API_URI}/partners/activate/${partnerId}`, {
      withCredentials: true,
    });
  }

  makeInactive(partnerId: string): Observable<void> {
    return this.http.put<void>(`${API_URI}/partners/block/${partnerId}`, {
      withCredentials: true,
    });
  }

  partnerLeaves(partnerId: string): Observable<void> {
    return this.http.put<void>(`${API_URI}/partners/leaves/${partnerId}`, {
      withCredentials: true,
    });
  }

  updateAccessCode(code: string, partnerId: string): Observable<void> {
    return this.http.put<void>(
      `${API_URI}/partners/access/${partnerId}`,
      { access_code: code },
      {
        withCredentials: true,
      }
    );
  }

  updatePartnersCash(data: IOperationPartnerCash): Observable<void> {
    const partnerDTO = this.partnerDTOMapper.toDTO(data.partner as IPartner);
    data.partner = partnerDTO;
    return this.http.put<void>(`${API_URI}/partners/cash`, data, {
      withCredentials: true,
    });
  }

  getPartnerDocument(
    partner: IPartner,
    documentType: DocumentTypes
  ): Observable<Blob> {
    const body = {
      partner: partner,
      documentType: documentType,
    };
    return this.http.post(`${API_URI}/partners/documents`, body, {
      responseType: 'blob',
      withCredentials: true,
    });
  }
  /**************************************FEES************************************************/
  createPartnerFee(fee: IFees): Observable<void> {
    const feesDTO = this.feesDTOMapper.toDTO(fee);
    return this.http.post<void>(`${API_URI}/fees/`, feesDTO, {
      withCredentials: true,
    });
  }

  getPartnersFees(partnerId: string): Observable<IFees[]> {
    return this.http
      .get<IFeesDTO[]>(`${API_URI}/fees/${partnerId}`, {
        withCredentials: true,
      })
      .pipe(map((fees: IFeesDTO[]) => this.feesDTOMapper.toDomainList(fees)));
  }

  getAllFees(): Observable<IFees[]> {
    return this.http
      .get<IFeesDTO[]>(`${API_URI}/fees`, {
        withCredentials: true,
      })
      .pipe(map((fees: IFeesDTO[]) => this.feesDTOMapper.toDomainList(fees)));
  }

  updateFee(fee: IFees): Observable<void> {
    const feesDTO = this.feesDTOMapper.toDTO(fee);
    return this.http.put<void>(`${API_URI}/fees`, feesDTO, {
      withCredentials: true,
    });
  }

  deleteFee(feeId: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/fees/${feeId}`, {
      withCredentials: true,
    });
  }

  getFeesTypes(): Observable<IFeesType[]> {
    return this.http.get<IFeesType[]>(`${API_URI}/fees/details/types`, {
      withCredentials: true,
    });
  }

  payFee(fee: IFees, account: string): Observable<void> {
    return this.http.put<void>(
      `${API_URI}/fees/payFee`,
      { fee, account },
      {
        withCredentials: true,
      }
    );
  }
  /**************************************FEES************************************************/

  /**************************************SANCTIONS************************************************/
  createSanction(sanction: ISanctions): Observable<ISanctions> {
    return this.http.post<ISanctions>(
      `${API_URI}/partners/sanctions/`,
      sanction,
      {
        withCredentials: true,
      }
    );
  }

  deleteSanction(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URI}/partners/sanctions/${id}`, {
      withCredentials: true,
    });
  }
}
