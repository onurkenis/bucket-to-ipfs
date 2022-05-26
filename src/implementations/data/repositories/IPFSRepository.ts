import {
  IPFSContentIdentifier,
  IPFSImportCandidate,
  IPFSUnavailableError,
} from "@interfaces/objects";
import { IConfigProvider, IConfigProviderType } from "@interfaces/utilities";
import { IIPFSRepository } from "@interfaces/data";

import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { IPFSHTTPClient, create } from "ipfs-http-client";

@injectable()
export class IPFSRepository implements IIPFSRepository {
  protected initializeResult: ResultAsync<void, IPFSUnavailableError> | null =
    null;
  protected httpClient: IPFSHTTPClient | null = null;
  protected gatewayUrl: string | null = null;

  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider
  ) {}

  public initialize(): ResultAsync<void, IPFSUnavailableError> {
    if (this.initializeResult == null) {
      // TODO: replace with logger
      console.log("Initializing IPFSRepository");

      this.initializeResult = this.configProvider
        .getConfig()
        .andThen((config) => {
          this.gatewayUrl = config.ipfsGatewayUrl;
          const ipfs = create({
            url: config.ipfsApiUrl,
          });

          return ResultAsync.fromPromise(ipfs.version(), (e) => {
            // TODO: replace with logger
            console.log(e);
            return new IPFSUnavailableError(
              "Failure during IPFS initialization",
              e
            );
          }).map(() => {
            // TODO: replace with logger
            console.log("IPFS initialized");

            this.httpClient = ipfs;
          });
        });
    }
    return this.initializeResult;
  }

  /**
   * Returns an IPFS http client to communicate with a remote IPFS node.
   * @returns A ResultAsync containing IPFSHTTPClient
   */
  public getHttpClient(): ResultAsync<IPFSHTTPClient, IPFSUnavailableError> {
    if (this.initializeResult == null || this.httpClient == null) {
      return errAsync(
        new IPFSUnavailableError(
          "Must call IPFSRepository.initialize() first before you can call getHttpClient()"
        )
      );
    }

    return this.initializeResult.map(() => {
      return this.httpClient as IPFSHTTPClient;
    });
  }

  /**
   * Returns IPFS gateway url.
   * @returns A ResultAsync containing gateway url as a string
   */
  public getGatewayUrl(): ResultAsync<string, IPFSUnavailableError> {
    if (this.initializeResult == null || this.gatewayUrl == null) {
      return errAsync(
        new IPFSUnavailableError(
          "Must call IPFSRepository.initialize() first before you can call getGatewayUrl()"
        )
      );
    }

    return this.initializeResult.map(() => {
      return this.gatewayUrl as string;
    });
  }

  /**
   * Sets gateway url.
   * @param gatewayUrl
   */
  public setGatewayUrl(gatewayUrl: string) {
    this.gatewayUrl = gatewayUrl;
  }

  /**
   * Saves file to IPFS and returns a cid.
   * @param file
   * @returns A ResultAsync containing IPFSContentIdentifier
   */
  public saveFile(
    file: IPFSImportCandidate
  ): ResultAsync<IPFSContentIdentifier, IPFSUnavailableError> {
    if (this.initializeResult == null || this.httpClient == null) {
      return errAsync(
        new IPFSUnavailableError("Must call IPFSRepository.initialize() first")
      );
    }

    return ResultAsync.fromPromise(
      this.httpClient.add(
        { path: file.filename, content: file.content },
        {
          progress: (prog) => console.log(`IPFS received: ${prog}`),
        }
      ),
      (e) => {
        // TODO: replace with logger
        console.log(e);
        return new IPFSUnavailableError("Failure during saving file to IPFS.");
      }
    ).andThen((addResult) => {
      const cid = IPFSContentIdentifier(addResult.cid.toString());
      // Content added with saveFile() (which by default also becomes pinned), is not
      // added to MFS. Any content can be lazily referenced from MFS with copyFile().
      return this.copyFile(cid, file.path)
        .map(() => {
          return cid;
        })
        .orElse((e) => {
          // TODO: replace with logger
          console.log(e);
          return okAsync(cid);
        });
    });
  }

  /**
   * Gets the related file with the given cid.
   * @param IPFSContentIdentifier
   * @returns A ResultAsync containing response
   */
  public getFile(
    cid: IPFSContentIdentifier
  ): ResultAsync<Response, IPFSUnavailableError> {
    if (this.initializeResult == null || this.gatewayUrl == null) {
      return errAsync(
        new IPFSUnavailableError("Must call IPFSRepository.initialize() first")
      );
    }

    const fileUrl = `${this.gatewayUrl}/ipfs/${cid}`;

    return ResultAsync.fromPromise(fetch(fileUrl), (e) => {
      // TODO: replace with logger
      console.log(e);
      return new IPFSUnavailableError("Failure during getting file from IPFS");
    });
  }

  /**
   * Copies files from one location to another.
   * @param IPFSContentIdentifier
   * @param destination optional
   */
  public copyFile(
    cid: IPFSContentIdentifier,
    filename: string
  ): ResultAsync<void, IPFSUnavailableError> {
    if (this.initializeResult == null || this.httpClient == null) {
      return errAsync(
        new IPFSUnavailableError("Must call IPFSRepository.initialize() first")
      );
    }

    const fromPath = `/ipfs/${cid}`;

    if (filename.charAt(0) !== "/") {
      filename = "/" + filename;
    }

    return ResultAsync.fromPromise(
      this.httpClient.files.cp([fromPath], filename),
      (e) => {
        // TODO: replace with logger
        console.log(e);
        return new IPFSUnavailableError("Failure during copying file in IPFS");
      }
    );
  }

  /**
   * Makes a directory in IPFS MFS
   * @param directoryName
   */
  public createDirectory(
    directoryName: string
  ): ResultAsync<void, IPFSUnavailableError> {
    if (this.initializeResult == null || this.httpClient == null) {
      return errAsync(
        new IPFSUnavailableError("Must call IPFSRepository.initialize() first")
      );
    }

    if (directoryName.charAt(0) !== "/") {
      directoryName = "/" + directoryName;
    }

    return ResultAsync.fromPromise(
      this.httpClient.files.mkdir(directoryName),
      (e) => {
        // TODO: replace with logger
        console.log(e);
        return new IPFSUnavailableError(
          "Failure during creating directory in IPFS"
        );
      }
    );
  }
}
