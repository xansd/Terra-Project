import { Observable } from 'rxjs';
import {
  Fees,
  FeesTypes,
  FeesVariants,
  IFees,
  IFeesType,
} from '../domain/fees';
import { Inject, Injectable } from '@angular/core';
import { IPartnerAPIPort } from '../domain/partner-api.port';
import { IPartner } from '../domain/partner';
import { InvalidFeeType } from '../domain/fees.exceptions';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';

export interface IFeesUseCases {
  createPartnerFee(fee: IFees): Observable<void>;
  getPartnersFees(partnerId: string): Observable<IFees[]>;
  getAllFees(): Observable<IFees[]>;
  updateFee(fee: IFees): Observable<void>;
  deleteFee(feeId: string): Observable<void>;
  getTypes(): Observable<IFeesType[]>;
  payFee(fee: Fees): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class FeesUseCases implements IFeesUseCases {
  constructor(
    @Inject('partnersAPI') private readonly partnersAPI: IPartnerAPIPort
  ) {}

  getPartnersFees(partnerId: string): Observable<IFees[]> {
    return this.partnersAPI.getPartnersFees(partnerId);
  }
  getAllFees(): Observable<IFees[]> {
    return this.partnersAPI.getAllFees();
  }
  updateFee(fee: IFees): Observable<void> {
    return this.partnersAPI.updateFee(fee);
  }
  deleteFee(feeId: string): Observable<void> {
    return this.partnersAPI.deleteFee(feeId);
  }
  getTypes(): Observable<IFeesType[]> {
    return this.partnersAPI.getFeesTypes();
  }
  payFee(fee: IFees): Observable<void> {
    return this.partnersAPI.payFee(fee);
  }
  createPartnerFee(fee: IFees): Observable<void> {
    return this.partnersAPI.createPartnerFee(fee);
  }

  createFee(partner: IPartner, type: FeesTypes): IFees {
    if (type === FeesTypes.FEES) {
      return Fees.create({
        partner_id: partner.partner_id,
        fees_type_id: partner.fee!,
      });
    } else if (type === FeesTypes.INSCRIPTION) {
      return Fees.create({
        partner_id: partner.partner_id,
        fees_type_id: partner.inscription!,
      });
    }
    throw new InvalidFeeType();
  }

  isFeeExpired(expiration: string): boolean {
    const currentDate = new Date();
    const expirationDate = new Date(expiration);
    return expirationDate <= currentDate;
  }

  isFeesCurrentMonth(expiration: string): boolean {
    const currentDate = new Date();
    const expirationDate = new Date(expiration);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const expirationMonth = expirationDate.getMonth();
    const expirationYear = expirationDate.getFullYear();

    return currentMonth === expirationMonth && currentYear === expirationYear;
  }

  isFee(fee: IFees): boolean {
    if (fee.fees_type_id > 2) return false;
    return true;
  }
  isInscription(fee: IFees): boolean {
    if (fee.fees_type_id > 2) return true;
    return false;
  }

  isFeeExent(fee: IFees): boolean {
    if (fee.fees_type_id === 2) return true;
    return false;
  }

  isInscriptionExent(fee: IFees): boolean {
    if (fee.fees_type_id === 3) return true;
    return false;
  }

  getFeesTypeString(feesType: FeesVariants): string {
    switch (feesType) {
      case FeesVariants.CUOTA_20:
        return 'CUOTA_20';
      case FeesVariants.CUOTA_EXENTA:
        return 'CUOTA_EXENTA';
      case FeesVariants.INSCRIPCION_EXENTA:
        return 'INSCRIPCION_EXENTA';
      case FeesVariants.INSCRIPCION_20:
        return 'INSCRIPCION_20';
      case FeesVariants.INSCRIPCION_10:
        return 'INSCRIPCION_10';
      default:
        return '';
    }
  }
}
