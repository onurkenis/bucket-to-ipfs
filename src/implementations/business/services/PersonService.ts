import { IPersonService } from "@interfaces/business";
import { IPersonRepository, IPersonRepositoryType } from "@interfaces/data";
import { DatabaseError, NewPerson, Person } from "@interfaces/objects";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";

@injectable()
export class PersonService implements IPersonService {
  public constructor(
    @inject(IPersonRepositoryType) protected personRepository: IPersonRepository
  ) {}

  public getById(id: number): ResultAsync<Person | null, DatabaseError> {
    return this.personRepository.getById(id);
  }

  public getAll(): ResultAsync<Person[], DatabaseError> {
    return this.personRepository.getAll();
  }

  public create(person: NewPerson): ResultAsync<Person, DatabaseError> {
    return this.personRepository.create(person);
  }
}
