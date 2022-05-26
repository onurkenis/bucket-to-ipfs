import { BucketConfig, Config } from "@interfaces/objects";
import { IConfigProvider } from "@interfaces/utilities";

import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

@injectable()
export class ConfigProvider implements IConfigProvider {
  protected config: Config;

  constructor() {
    this.config = new Config(
      process.env.DATABASE_URL || "mysql://root:admin@localhost:3306/app",
      process.env.IPFS_GATEWAY_URL || "http://localhost:8080",
      process.env.IPFS_API_URL || "http://localhost:5001",
      new BucketConfig(
        process.env.GOOGLE_PROJECT_ID || "profound-ripsaw-232522",
        process.env.GOOGLE_CREDENTIAL_FILE_PATH ||
          "credentials/ipfs-service-credential.json",
        process.env.GOOGLE_BUCKET_NAME ||
          "onur-test-bucket",
        process.env.GOOGLE_BUCKET_SUBSCRIPTION_ID ||
          "onur-test-file-upload-sub"
      )
    );
  }

  public getConfig(): ResultAsync<Config, never> {
    return okAsync(this.config);
  }
}
