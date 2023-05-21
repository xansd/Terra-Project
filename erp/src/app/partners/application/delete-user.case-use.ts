import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { IPartnerAPIPort } from '../domain/partner-api.port';

export interface IDeletePartnerUseCase {
  deletePartner(id: string): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class DeletePartnerUseCase implements IDeletePartnerUseCase {
  constructor(
    @Inject('partnersAPI') private readonly partnersAPI: IPartnerAPIPort
  ) {}
  deletePartner(id: string): Observable<void> {
    return this.partnersAPI.deletePartner(id);
  }
}
