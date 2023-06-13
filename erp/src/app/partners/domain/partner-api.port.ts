import { Observable } from 'rxjs';
import { DocumentTypes, IPartner, IPartnersType } from './partner';
import { IFees, IFeesType } from './fees';

export interface IPartnerAPIPort {
  getPartner(partnerId: string): Observable<IPartner>;
  getAllPartners(): Observable<IPartner[]>;
  getAllPartnersFiltered(): Observable<Partial<IPartner[]>>;
  getPartnersType(): Observable<IPartnersType[]>;
  getPartnerLastNumber(): Observable<object>;
  createPartner(partner: IPartner): Observable<IPartner>;
  updatePartner(partner: IPartner): Observable<void>;
  deletePartner(partnerId: string): Observable<void>;
  makeActive(partnerId: string): Observable<void>;
  makeInactive(partnerId: string): Observable<void>;
  partnerLeaves(partnerId: string): Observable<void>;
  updateAccessCode(code: string, partnerId: string): Observable<void>;
  updatePartnersCash(amount: number, partnerId: string): Observable<void>;
  getPartnerDocument(
    partner: IPartner,
    documentType: DocumentTypes
  ): Observable<object>;

  createPartnerFee(fee: IFees): Observable<void>;
  getPartnersFees(partnerId: string): Observable<IFees[]>;
  getAllFees(): Observable<IFees[]>;
  updateFee(fee: IFees): Observable<void>;
  deleteFee(feeId: string): Observable<void>;
  getFeesTypes(): Observable<IFeesType[]>;
  payFee(fee: IFees): Observable<void>;
}
