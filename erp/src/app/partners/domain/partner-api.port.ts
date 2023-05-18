import { Observable } from 'rxjs';
import { IPartner } from './partner';

export interface IPartnerPort {
  getPartner(partnerId: string): Observable<IPartner>;
  getAllPartners(): Observable<IPartner[]>;
  createPartner(): Observable<void>;
  updatePartner(partner: IPartner): Observable<void>;
  deletePartner(partnerId: string): Observable<void>;
  makeActive(partnerId: string): Observable<void>;
  makeInactive(partnerId: string): Observable<void>;
  uploadPartnerDocument(partnerId: string, file: File): Observable<void>;
  getPartnerDocument(partnerId: string): Observable<File>;
  getAllPartnerDocuments(partnerId: string): Observable<File[]>;
  deletePartnerDocument(documentId: string): Observable<void>;
}
