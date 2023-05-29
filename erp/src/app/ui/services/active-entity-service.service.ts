import { Injectable } from '@angular/core';

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
}
