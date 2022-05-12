import { Person } from "@interfaces/objects";

export class PersonViewModel {
    public id: Number;
    public firstName: string;
    public lastName: string;
  
    constructor(person: Person) {
      this.id = person.id;
      this.firstName = person.firstName;
      this.lastName = person.lastName;
    }
  }
  