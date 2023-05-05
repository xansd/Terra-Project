import { LocalRepository } from '../../shared/infraestructure/local-repository.interface';

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
