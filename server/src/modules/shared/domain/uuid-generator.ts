import { v4 as uuidv4 } from "uuid";
import { IUniqueIDGenerator } from "./unique-entity-id";

export class UUIDGenerator implements IUniqueIDGenerator {
  generate(): string {
    return uuidv4();
  }
}
