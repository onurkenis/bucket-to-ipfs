import {
  IBucketRepository,
  IBucketRepositoryType,
  IIPFSRepository,
  IIPFSRepositoryType,
} from "@interfaces/data";
import {
  IPFSUnavailableError,
  BucketUnavailableError,
  IPFSImportCandidate,
  UrlString,
} from "@interfaces/objects";
import { IFileService } from "@interfaces/business";

import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class FileService implements IFileService {
  public constructor(
    @inject(IBucketRepositoryType)
    protected googleBucketRepository: IBucketRepository,
    @inject(IIPFSRepositoryType)
    protected ipfsRepository: IIPFSRepository
  ) {
    this.googleBucketRepository.initialize();
    this.ipfsRepository.initialize();
  }

  public onFileUploaded(
    filePath: string,
    fileName: string
  ): ResultAsync<void, IPFSUnavailableError | BucketUnavailableError> {
    return this.googleBucketRepository
      .downloadFileIntoMemory(filePath)
      .andThen((fileContent: Uint8Array) => {
        return this.ipfsRepository.saveFile(
          new IPFSImportCandidate(filePath, fileName, fileContent)
        );
      })
      .map((ipfsContentIdentifier) => {
        console.log(
          `File with IPFS Content Identifier: ${ipfsContentIdentifier} is pinned.`
        );
      });
  }

  public getSignedUrl(
    fileName: string
  ): ResultAsync<UrlString, IPFSUnavailableError | BucketUnavailableError> {
    return this.googleBucketRepository.getSignedUrl(fileName);
  }
}
