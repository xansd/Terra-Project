export interface LocalRepository<T extends string> {
  set(key: string, value: T): void;
  get(key: string): T | null;
  remove(key: string): void;
}
