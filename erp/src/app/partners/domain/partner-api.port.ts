import { Observable } from 'rxjs';
import { IPartner } from './partner';

export interface IPartnerAPIPort {
  getPartner(partnerId: string): Observable<IPartner>;
  getAllPartners(): Observable<IPartner[]>;
  createPartner(partner: IPartner): Observable<void>;
  updatePartner(partner: IPartner): Observable<void>;
  deletePartner(partnerId: string): Observable<void>;
  makeActive(partnerId: string): Observable<void>;
  makeInactive(partnerId: string): Observable<void>;
}
