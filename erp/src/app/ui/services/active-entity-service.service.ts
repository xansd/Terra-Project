import { Injectable } from '@angular/core';
import { IPartner } from 'src/app/partners/domain/partner';
import { IProduct } from 'src/app/products/domain/products';
import { IProvider } from 'src/app/providers/domain/providers';
import { IHarvests } from 'src/app/purchases/domain/harvests';
import { IPurchase } from 'src/app/purchases/domain/purchases';

@Injectable({
  providedIn: 'root',
})
export class ActiveEntityService {
  private activeEntity: any;
  private activeEntityId: string | undefined;
  private activePartner!: IPartner;
  private activeCultivator!: IProvider;
  private activeVariety!: IProduct;
  private activeHarvest!: IHarvests;
  private activeProduct!: IProduct;
  private activePurchase!: IPurchase;
  private activeProvider!: IProvider;

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
