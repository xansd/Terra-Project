import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { IPartner, IPartnersType } from '../domain/partner';
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
  getPartner(id: string): Observable<IPartner> {
    return this.partnersAPI.getPartner(id);
  }
  getPartnersType(): Observable<IPartnersType[]> {
    return this.partnersAPI.getPartnersType();
  }
  getPartnerLastNumber(): Observable<object> {
    return this.partnersAPI.getPartnerLastNumber();
  }
}
