import {
  IPFSUnavailableError,
  BucketUnavailableError,
  UrlString,
} from "@interfaces/objects";

import { ResultAsync } from "neverthrow";

export interface IFileService {
  onFileUploaded(
    filePath: string,
    fileName: string
  ): ResultAsync<void, IPFSUnavailableError | BucketUnavailableError>;

  getSignedUrl(
    fileName: string
  ): ResultAsync<UrlString, BucketUnavailableError>;
}

export const IFileServiceType = Symbol.for("IIFileService");
