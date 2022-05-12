import { DatabaseError, NewPerson, Person } from "@interfaces/objects";
import { ResultAsync } from "neverthrow";

export interface IPersonRepository {
  getAll(): ResultAsync<Person[], DatabaseError>;
  getById(id: number): ResultAsync<Person | null, DatabaseError>;
  create(person: NewPerson): ResultAsync<Person, DatabaseError>;
}

export const IPersonRepositoryType = Symbol.for("IPersonRepository");
