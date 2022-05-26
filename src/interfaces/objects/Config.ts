export class Config {
  constructor(
    public databaseConnectionString: string,
    public ipfsGatewayUrl: string,
    public ipfsApiUrl: string,
    public googleBucketConfig: BucketConfig
  ) {}
}

export class BucketConfig {
  constructor(
    public projectId: string,
    public keyFilename: string,
    public bucketName: string,
    public subscriptionId: string
  ) {}
}
