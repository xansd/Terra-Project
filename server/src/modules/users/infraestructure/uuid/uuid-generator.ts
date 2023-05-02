import { v4 as uuidv4 } from "uuid";
import { IUniqueIDGenerator } from "../../../shared/domain/unique-entity-id";

export class UUIDGenerator implements IUniqueIDGenerator {
  generate(): string {
    return uuidv4();
  }
}
