import { Config } from "@interfaces/objects";
import { IConfigProvider } from "@interfaces/utilities";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

@injectable()
export class ConfigProvider implements IConfigProvider {
  protected config: Config;

  constructor() {
    this.config = new Config(
      process.env.DATABASE_URL || "mysql://root:admin@localhost:3306/app"
    );
  }

  public getConfig(): ResultAsync<Config, never> {
    return okAsync(this.config);
  }
}
