import { BaseError } from "@interfaces/objects/BaseError";

export class DatabaseError extends BaseError {
  constructor(msg: string, src: unknown | null) {
    super(msg, 500, "ERR_DATABASE", src, true);
  }
}
