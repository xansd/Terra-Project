import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { IPartnerAPIPort } from '../domain/partner-api.port';

export interface IActivatePartnerUseCase {
  activatePartner(id: string): Observable<void>;
}

export interface IBlockPartnerUseCase {
  blockPartner(id: string): Observable<void>;
}

@Injectable({
  providedIn: 'root',
})
export class TogglePartnerActivationUseCase
  implements IActivatePartnerUseCase, IBlockPartnerUseCase
{
  constructor(
    @Inject('partnersAPI') private readonly partnersAPI: IPartnerAPIPort
  ) {}

  activatePartner(id: string): Observable<void> {
    return this.partnersAPI.makeActive(id);
  }

  blockPartner(id: string): Observable<void> {
    return this.partnersAPI.makeInactive(id);
  }
}
