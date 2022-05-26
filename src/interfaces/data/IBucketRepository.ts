import { BucketUnavailableError, UrlString } from "@interfaces/objects";

import { PubSub, Subscription } from "@google-cloud/pubsub";
import { Storage } from "@google-cloud/storage";
import { ResultAsync } from "neverthrow";

export interface IBucketRepository {
  initialize(): ResultAsync<void, BucketUnavailableError>;
  getStorageClient(): ResultAsync<Storage, BucketUnavailableError>;
  getPubSubClient(): ResultAsync<PubSub, BucketUnavailableError>;
  getSubscription(): ResultAsync<Subscription, BucketUnavailableError>;
  getSignedUrl(
    filename: string
  ): ResultAsync<UrlString, BucketUnavailableError>;
  downloadFile(filename: string): ResultAsync<void, BucketUnavailableError>;
  downloadFileIntoMemory(
    filename: string
  ): ResultAsync<Uint8Array, BucketUnavailableError>;
  uploadFile(
    filePath: string,
    content: Buffer
  ): ResultAsync<void, BucketUnavailableError>;
}

export const IBucketRepositoryType = Symbol.for("IBucketRepository");
