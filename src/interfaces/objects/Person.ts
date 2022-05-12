export class NewPerson {
	public constructor(
		public firstName: string,
		public lastName: string,
	) {}
}

export class Person extends NewPerson {
	public constructor(
		public id: Number,
		firstName: string,
		lastName: string,
		public creationTimestamp: Number,
		public updatedTimestamp: Number,
	) {
		super(firstName, lastName);
	}
}
