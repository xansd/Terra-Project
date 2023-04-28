import { UniqueEntityID } from "./unique-entity-id";

export abstract class Entity<T> {
  readonly _id: UniqueEntityID;
  _props: T;

  constructor(props: T, id?: UniqueEntityID) {
    this._id = id || new UniqueEntityID();
    this._props = props;
  }

  get props(): T {
    return this._props;
  }

  set props(props: T) {
    this._props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!this.isEntity(object)) {
      return false;
    }
    return this._id.equals(object._id);
  }

  private isEntity(object: any): object is Entity<T> {
    return object instanceof Entity;
  }
}
