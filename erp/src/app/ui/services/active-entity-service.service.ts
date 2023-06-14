import { Injectable } from '@angular/core';
import { IPartner } from 'src/app/partners/domain/partner';
import { IProduct } from 'src/app/products/domain/products';

@Injectable({
  providedIn: 'root',
})
export class ActiveEntityService {
  private activeEntity: any;
  private activeEntityId: string | undefined;

  setActiveEntity(entity: any, entityId: string): void {
    this.activeEntity = entity;
    this.activeEntityId = entityId;
  }

  getActiveEntity(): any {
    return this.activeEntity;
  }

  getActiveEntityId(): string | undefined {
    return this.activeEntityId;
  }

  clearActiveEntity(): void {
    this.activeEntity = undefined;
    this.activeEntityId = undefined;
  }

  getActiveEntityType(obj: IProduct | IPartner): string {
    if (typeof obj === 'object' && obj.hasOwnProperty('product_id')) {
      return 'product';
    } else if (typeof obj === 'object' && obj.hasOwnProperty('partner_id')) {
      return 'partner';
    } else {
      return 'unknow';
    }
  }
}
