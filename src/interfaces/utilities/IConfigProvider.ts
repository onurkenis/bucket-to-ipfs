import { Config, DatabaseError } from "@interfaces/objects";
import { ResultAsync } from "neverthrow";

export interface IConfigProvider {
	getConfig(): ResultAsync<Config, DatabaseError>;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
