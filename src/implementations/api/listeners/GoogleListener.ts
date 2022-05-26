import {
  BucketUnavailableError,
  IPFSUnavailableError,
} from "@interfaces/objects";
import { IGoogleListener } from "@interfaces/api/listeners";
import { IBucketRepository, IBucketRepositoryType } from "@interfaces/data";
import { IConfigProvider, IConfigProviderType } from "@interfaces/utilities";
import { IFileService, IFileServiceType } from "@interfaces/business";

import { Message, Subscription } from "@google-cloud/pubsub";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
@injectable()
export class GoogleListener implements IGoogleListener {
  protected initializeResult: ResultAsync<void, IPFSUnavailableError> | null =
    null;

  public constructor(
    @inject(IBucketRepositoryType)
    protected googleBucketRepository: IBucketRepository,

    @inject(IFileServiceType)
    protected fileService: IFileService,
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider
  ) {}

  public initialize(): ResultAsync<void, BucketUnavailableError> {
    if (this.initializeResult == null) {
      this.initializeResult = this.googleBucketRepository
        .getSubscription()
        .map((subscription) => {
          this.listenSubscriptionMessages(subscription);
        });
    }
    return this.initializeResult;
  }

  private listenSubscriptionMessages(subscription: Subscription): void {
    subscription.on("message", async (message: Message) => {
      try {
        const data = JSON.parse(message.data.toString());

        // TODO: support files inside folders.
        const filePath = data.filename;
        const fileName = data.filename;

        const result = await this.fileService.onFileUploaded(
          filePath,
          fileName
        );

        if (result.isErr()) {
          throw result.error;
        }
      } catch (e) {
        // TODO: replace with logger
        console.log(e);
        console.log("Bucket Listener failed to parse the message");
      } finally {
        message.ack();
      }
    });
  }
}
