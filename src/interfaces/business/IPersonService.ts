import { DatabaseError, NewPerson, Person } from "@interfaces/objects";
import { ResultAsync } from "neverthrow";

export interface IPersonService {
  getAll(): ResultAsync<Person[] | null, DatabaseError>;
  getById(id: number): ResultAsync<Person | null, DatabaseError>;
  create(person: NewPerson): ResultAsync<Person, DatabaseError>;
}

export const IPersonServiceType = Symbol.for("IPersonService");
