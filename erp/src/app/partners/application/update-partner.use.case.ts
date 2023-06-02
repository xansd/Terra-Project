import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { IPartnerAPIPort } from '../domain/partner-api.port';
import { IPartner } from '../domain/partner';
import { IAuthToken } from 'src/app/auth/domain/token';

export interface IUpdatePartnerUseCase {
  updatePartner(partner: IPartner): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class UpdatePartnerUseCase implements IUpdatePartnerUseCase {
  constructor(
    @Inject('partnersAPI') private readonly partnersAPI: IPartnerAPIPort,
    @Inject('authToken') private authTokenService: IAuthToken
  ) {}

  updatePartner(partner: IPartner): Observable<void> {
    return this.partnersAPI.updatePartner(partner);
  }

  getUpdater(): string {
    return this.authTokenService.getUserID();
  }

  updateAccessCode(code: string, partnerId: string): Observable<void> {
    return this.partnersAPI.updateAccessCode(code, partnerId);
  }
}
