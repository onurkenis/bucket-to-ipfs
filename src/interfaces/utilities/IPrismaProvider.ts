import { DatabaseError } from "@interfaces/objects";
import { PrismaClient } from "@src/prisma/client";
import { ResultAsync } from "neverthrow";

export interface IPrismaProvider {
	getPrismaClient(): ResultAsync<PrismaClient, DatabaseError>;
}

export const IPrismaProviderType = Symbol.for("IPrismaProvider");
