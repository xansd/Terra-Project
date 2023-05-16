import { Injectable } from '@angular/core';
import { LocalRepository } from '../domain/local-repository.port';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageRepository<T extends string>
  implements LocalRepository<T>
{
  set(key: string, value: T): void {
    localStorage.setItem(key, value);
  }

  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
