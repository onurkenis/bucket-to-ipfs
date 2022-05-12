
import { DatabaseError } from "@interfaces/objects";
import { IConfigProvider, IConfigProviderType } from "@interfaces/utilities";
import { IPrismaProvider } from "@interfaces/utilities";
import { PrismaClient } from "@src/prisma/client";
import { inject, injectable } from "inversify";

import { ResultAsync } from "neverthrow";

@injectable()
export class PrismaProvider implements IPrismaProvider {
	protected prismaResult:
		| ResultAsync<PrismaClient, DatabaseError>
		| undefined;
	protected prisma: PrismaClient | undefined;

	constructor(
		@inject(IConfigProviderType) protected configProvider: IConfigProvider,
	) {}

	public getPrismaClient(): ResultAsync<PrismaClient, DatabaseError> {
		if (this.prismaResult == null) {
			this.prismaResult = this.initializeDatabase();
		}
		return this.prismaResult;
	}

	protected initializeDatabase(): ResultAsync<PrismaClient, DatabaseError> {
		return this.configProvider.getConfig().map((config) => {
			this.prisma = new PrismaClient({
				datasources: {
					db: {
						url: config.databaseConnectionString,
					},
				},
			});

			return this.prisma;
		});
	}
}
