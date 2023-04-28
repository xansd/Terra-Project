export interface Entity<T> {
  id?: T;
  equals?(object?: Entity<T>): boolean;
}
