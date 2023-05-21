import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPartner } from '../domain/partner';
import { IPartnerAPIPort } from '../domain/partner-api.port';

export interface ICreatePartnerUseCase {
  createPartner(partner: IPartner): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class CreatePartnerUseCase implements ICreatePartnerUseCase {
  constructor(
    @Inject('partnersAPI') private readonly partnersAPI: IPartnerAPIPort
  ) {}
  createPartner(partner: IPartner): Observable<void> {
    return this.partnersAPI.createPartner(partner);
  }
}
