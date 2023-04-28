import { v4 as uuidv4 } from "uuid";
import { IUniqueIDGenerator } from "../../../shared/domain/interfaces/unique-id-generator.interface";

export class UUIDGenerator implements IUniqueIDGenerator {
  generate(): string {
    return uuidv4();
  }
}
