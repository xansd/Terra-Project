export interface IRepository<E> {
  getById(id: string): Promise<E>;
  getAll(): Promise<E[]>;
  create(entity: E): Promise<void>;
  update(entity: E): Promise<void>;
  delete(id: string): Promise<void>;
}
