import { Injectable } from '@angular/core';
import { LocalRepository } from '../domain/local-repository.port';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageRepository<T extends string>
  implements LocalRepository<T>
{
  set(key: string, value: T): void {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  }

  get(key: string): T | null {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    return JSON.parse(serializedValue) as T;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
