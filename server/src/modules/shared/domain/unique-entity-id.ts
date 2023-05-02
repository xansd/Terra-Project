export interface IUniqueIDGenerator {
  generate(): string;
}

export class UniqueEntityID {
  private readonly _id: string;

  constructor(id?: string, idGenerator?: IUniqueIDGenerator) {
    if (id && typeof id !== "string") {
      throw new Error("ID must be a string");
    }
    this._id = id || (idGenerator ? idGenerator.generate() : "");
  }

  get value(): string {
    return this._id;
  }

  equals(other: UniqueEntityID): boolean {
    return this._id === other._id;
  }
}
