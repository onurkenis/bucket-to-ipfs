import { IPersonService } from "@interfaces/business";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";

@injectable()
export class PersonService implements IPersonService {
  public constructor() {}
}
