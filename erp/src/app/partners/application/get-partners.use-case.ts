import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { IPartner, IPartnersType, DocumentTypes } from '../domain/partner';
import { IPartnerAPIPort } from '../domain/partner-api.port';

export interface IGetAllPartnerUserCase {
  getAllPartners(): Observable<IPartner[]>;
}
export interface IGetPartnerUserCase {
  getPartner(id: string): Observable<IPartner>;
}
@Injectable({
  providedIn: 'root',
})
export class GetPartnerUseCase
  implements IGetAllPartnerUserCase, IGetPartnerUserCase
{
  constructor(
    @Inject('partnersAPI') private readonly partnersAPI: IPartnerAPIPort
  ) {}
  getAllPartners(): Observable<IPartner[]> {
    return this.partnersAPI.getAllPartners();
  }
  getAllPartnersFiltered(): Observable<Partial<IPartner[]>> {
    return this.partnersAPI.getAllPartnersFiltered();
  }
  getPartner(id: string): Observable<IPartner> {
    return this.partnersAPI.getPartner(id);
  }
  getPartnersType(): Observable<IPartnersType[]> {
    return this.partnersAPI.getPartnersType();
  }
  getPartnerLastNumber(): Observable<object> {
    return this.partnersAPI.getPartnerLastNumber();
  }

  getPartnerDocument(
    partner: IPartner,
    documentType: DocumentTypes
  ): Observable<object> {
    return this.partnersAPI.getPartnerDocument(partner, documentType);
  }

  getPartnerConduct(partner: IPartner): number {
    let condcut = 0;
    if (!partner.sanctions || partner.sanctions.length === 0) {
      return condcut;
    }
    for (const i of partner.sanctions!) {
      condcut += i.severity;
    }
    return condcut;
  }
}
