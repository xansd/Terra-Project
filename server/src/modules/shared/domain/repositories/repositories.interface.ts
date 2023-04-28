export interface IRepository<E, T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[] | null>;
  create(entity: E): Promise<T | null>;
  update(entity: E): Promise<T | null>;
  delete(entity: E): Promise<T | null>;
}
