import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPartner } from '../domain/partner';
import { IPartnerAPIPort } from '../domain/partner-api.port';
import { IAuthToken } from 'src/app/auth/domain/token';
import { ISanctions } from '../domain/sanctions';

export interface ICreatePartnerUseCase {
  createPartner(partner: IPartner): Observable<IPartner>;
}
@Injectable({
  providedIn: 'root',
})
export class CreatePartnerUseCase implements ICreatePartnerUseCase {
  constructor(
    @Inject('partnersAPI') private readonly partnersAPI: IPartnerAPIPort,
    @Inject('authToken') private authTokenService: IAuthToken
  ) {}

  createPartner(partner: IPartner): Observable<IPartner> {
    return this.partnersAPI.createPartner(partner);
  }

  createSanction(sanction: ISanctions): Observable<ISanctions> {
    return this.partnersAPI.createSanction(sanction);
  }

  getCreator(): string {
    return this.authTokenService.getUserID();
  }
}
