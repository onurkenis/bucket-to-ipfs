import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IPersonRepository } from "@interfaces/data";
import { IPrismaProvider, IPrismaProviderType } from "@interfaces/utilities";
import { DatabaseError, NewPerson, Person } from "@interfaces/objects";
import { PersonEntity } from "@src/prisma/client";

@injectable()
export class PersonRepository implements IPersonRepository {
  public constructor(
    @inject(IPrismaProviderType) protected prismaProvider: IPrismaProvider
  ) {}

  public getById(id: number): ResultAsync<Person | null, DatabaseError> {
    return this.prismaProvider.getPrismaClient().andThen((prisma) => {
      return ResultAsync.fromPromise(
        prisma.personEntity.findFirst({
          where: {
            id,
          },
        }),
        (e) => {
          return new DatabaseError((e as Error).message, e);
        }
      ).map((entity) => {
        if (entity == null) {
          return null;
        }
        return this.entityToObject(entity);
      });
    });
  }

  public getAll(): ResultAsync<Person[], DatabaseError> {
    return this.prismaProvider
      .getPrismaClient()
      .andThen((prisma) => {
        return ResultAsync.fromPromise(
          prisma.personEntity.findMany({}),
          (e) => {
            return new DatabaseError((e as Error).message, e);
          }
        );
      })
      .map((entities) => {
        return entities.map((entity) => this.entityToObject(entity));
      });
  }

  public create(person: NewPerson): ResultAsync<Person, DatabaseError> {
    return this.prismaProvider.getPrismaClient().andThen((prisma) => {
      return ResultAsync.fromPromise(
        prisma.personEntity.create({
          data: {
            first_name: person.firstName,
            last_name: person.lastName,
          },
        }),
        (e) => {
          return new DatabaseError((e as Error).message, e);
        }
      ).map((entity) => {
        return this.entityToObject(entity);
      });
    });
  }

  public entityToObject(entity: PersonEntity): Person {
    return new Person(
      entity.id,
      entity.first_name,
      entity.last_name,
      Math.floor(entity.updated_timestamp.getTime() / 1000),
      Math.floor(entity.created_timestamp.getTime() / 1000)
    );
  }
}
