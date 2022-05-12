import { IPersonService, IPersonServiceType } from "@interfaces/business";
import { NewPerson, Person } from "@interfaces/objects";
import { Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  BaseHttpController,
  requestBody,
  httpGet,
  requestParam,
  response,
} from "inversify-express-utils";

interface IAddPerson {
  firstName: string;
  lastName: string;
}

@controller("/people")
export class AdminController extends BaseHttpController {
  constructor(
    @inject(IPersonServiceType) protected personService: IPersonService
  ) {
    super();
  }

  @httpGet("/test")
  public async test(@response() res: Response) {
    res.setHeader("test", "test value");
    res.status(201).json({ msg: "test" });
    return res;
  }

  @httpGet("/")
  public async getPeople() {
    const getPeopleResult = await this.personService.getAll();

    if (getPeopleResult.isOk()) {
      return this.json(
        getPeopleResult.value?.map((person) => new PersonViewModel(person))
      );
    }

    throw getPeopleResult.error;
  }

  @httpGet("/:personId")
  public async getPerson(@requestParam("personId") personId: number) {
    const getPersonResult = await this.personService.getById(personId);

    if (!getPersonResult.isOk()) {
      throw getPersonResult.error;
    }

    if (!getPersonResult.value) {
      return this.json(undefined, 404);
    }

    return this.json({
      firstName: getPersonResult.value.firstName,
      lastName: getPersonResult.value.lastName,
    });
  }

  @httpPost("/")
  public async addPerson(
    @requestBody() requestBody: IAddPerson,
    @response() res: Response
  ) {
    const addPersonResult = await this.personService.create(
      new NewPerson(requestBody.firstName, requestBody.lastName)
    );

    if (addPersonResult.isOk()) {
      res.setHeader(
        "Location",
        `people/${addPersonResult.value.id.toString()}`
      );
      res.status(201).json();

      return res;
    }

    throw addPersonResult.error;
  }
}

class PersonViewModel {
  public firstName: string;
  public lastName: string;
  constructor(person: Person) {
    this.firstName = person.firstName;
    this.lastName = person.lastName;
  }
}
