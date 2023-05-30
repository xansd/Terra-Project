import { Observable } from 'rxjs';
import { IPartner, IPartnersType } from './partner';

export interface IPartnerAPIPort {
  getPartner(partnerId: string): Observable<IPartner>;
  getAllPartners(): Observable<IPartner[]>;
  getAllPartnersFiltered(): Observable<Partial<IPartner[]>>;
  getPartnersType(): Observable<IPartnersType[]>;
  getPartnerLastNumber(): Observable<object>;
  createPartner(partner: IPartner): Observable<void>;
  updatePartner(partner: IPartner): Observable<void>;
  deletePartner(partnerId: string): Observable<void>;
  makeActive(partnerId: string): Observable<void>;
  makeInactive(partnerId: string): Observable<void>;
  partnerLeaves(partnerId: string): Observable<void>;
}
