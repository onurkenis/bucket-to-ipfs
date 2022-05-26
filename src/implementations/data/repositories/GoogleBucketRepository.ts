import { IBucketRepository } from "@interfaces/data";
import { BucketUnavailableError, UrlString } from "@interfaces/objects";
import { IConfigProvider, IConfigProviderType } from "@interfaces/utilities";

import { PubSub, Subscription } from "@google-cloud/pubsub";
import { Storage } from "@google-cloud/storage";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

@injectable()
export class GoogleBucketRepository implements IBucketRepository {
  protected initializationPromise: ResultAsync<
    void,
    BucketUnavailableError
  > | null = null;
  protected storageClient: Storage | null = null;
  protected pubSubClient: PubSub | null = null;

  protected subscription: Subscription | null = null;

  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider
  ) {
    this.storageClient = null;
    this.pubSubClient = null;
    this.initializationPromise = null;
  }

  public initialize(): ResultAsync<void, BucketUnavailableError> {
    if (this.initializationPromise == null) {
      this.initializationPromise = this.configProvider
        .getConfig()
        .andThen((config) => {
          try {
            const clientConfig = {
              projectId: config.googleBucketConfig.projectId,
              keyFilename: config.googleBucketConfig.keyFilename,
            };
            this.storageClient = new Storage(clientConfig);
            this.pubSubClient = new PubSub(clientConfig);
            this.subscription = this.pubSubClient.subscription(
              config.googleBucketConfig.subscriptionId
            );
          } catch (e) {
            return errAsync(
              new BucketUnavailableError(
                "Failure during Google Bucket initialization",
                e
              )
            );
          }
          return okAsync(undefined);
        });
    }

    return this.initializationPromise;
  }

  public getStorageClient(): ResultAsync<Storage, BucketUnavailableError> {
    return this.initialize().map(() => {
      if (this.storageClient == null) {
        throw new BucketUnavailableError("Storage Client is not available");
      }

      return this.storageClient;
    });
  }

  public getPubSubClient(): ResultAsync<PubSub, BucketUnavailableError> {
    return this.initialize().map(() => {
      if (this.pubSubClient == null) {
        throw new BucketUnavailableError("PubSub Client is not available");
      }

      return this.pubSubClient;
    });
  }

  public getSubscription(): ResultAsync<Subscription, BucketUnavailableError> {
    return this.initialize().map(() => {
      if (this.subscription == null) {
        throw new BucketUnavailableError("Subscription is not available");
      }

      return this.subscription;
    });
  }

  public getSignedUrl(
    filename: string
  ): ResultAsync<UrlString, BucketUnavailableError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (this.storageClient == null) {
        return errAsync(
          new BucketUnavailableError(
            "Must call GoogleBucketRepository.initialize() first before you can call getSignedUrl()"
          )
        );
      }

      return ResultAsync.fromPromise(
        this.storageClient
          .bucket(config.googleBucketConfig.bucketName)
          .file(filename)
          .getSignedUrl({
            action: "write",
            version: "v4",
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            contentType: "application/octet-stream",
          }),
        (e) => {
          // TODO: replace with logger
          console.log(e);
          return new BucketUnavailableError(
            "Function call getSignedUrl() failed"
          );
        }
      ).map(([url]) => {
        return UrlString(url);
      });
    });
  }

  public downloadFile(
    filename: string
  ): ResultAsync<void, BucketUnavailableError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (this.storageClient == null) {
        return errAsync(
          new BucketUnavailableError(
            "Must call GoogleBucketRepository.initialize() first before you can call downloadFile()"
          )
        );
      }

      return ResultAsync.fromPromise(
        this.storageClient
          .bucket(config.googleBucketConfig.bucketName)
          .file(filename)
          .download({
            destination: `${DOWNLOADS_FOLDER_PATH}/${filename}`,
          }),
        (e) => {
          // TODO: replace with logger
          console.log(e);
          return new BucketUnavailableError(
            "Function call downloadFile() failed"
          );
        }
      ).andThen(() => {
        return okAsync(undefined);
      });
    });
  }

  public downloadFileIntoMemory(
    filename: string
  ): ResultAsync<Uint8Array, BucketUnavailableError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (this.storageClient == null) {
        return errAsync(
          new BucketUnavailableError(
            "Must call GoogleBucketRepository.initialize() first before you can call downloadFileIntoMemory()"
          )
        );
      }

      return ResultAsync.fromPromise(
        this.storageClient
          .bucket(config.googleBucketConfig.bucketName)
          .file(filename)
          .download(),
        (e) => {
          // TODO: replace with logger
          console.log(e);
          return new BucketUnavailableError(
            "Function call downloadFileIntoMemory() failed"
          );
        }
      ).map((contents) => {
        return new Uint8Array(contents[0]);
      });
    });
  }

  public uploadFile(
    filePath: string,
    content: Buffer
  ): ResultAsync<void, BucketUnavailableError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (this.storageClient == null) {
        return errAsync(
          new BucketUnavailableError(
            "Must call GoogleBucketRepository.initialize() first before you can call uploadFile()"
          )
        );
      }

      return ResultAsync.fromPromise(
        this.storageClient
          .bucket(config.googleBucketConfig.bucketName)
          .file(filePath)
          .save(content),
        (e) => {
          // TODO: replace with logger
          console.log(e);
          return new BucketUnavailableError(
            "Function call uploadFile() failed"
          );
        }
      );
    });
  }
}

// TODO: Get from env variable
export const DOWNLOADS_FOLDER_PATH = "/Users/onur/Desktop/person-api/downloads";
