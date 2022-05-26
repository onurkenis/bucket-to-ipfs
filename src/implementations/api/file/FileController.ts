import {
  IGoogleListener,
  IGoogleListenerType,
} from "@interfaces/api/listeners";
import { IFileService, IFileServiceType } from "@interfaces/business";
import { IBucketRepository, IBucketRepositoryType } from "@interfaces/data";
import { Response } from "express";
import { inject } from "inversify";
import {
  controller,
  BaseHttpController,
  httpGet,
  response,
  httpPost,
  requestBody,
} from "inversify-express-utils";

@controller("/files")
export class FileController extends BaseHttpController {
  constructor(
    @inject(IGoogleListenerType) protected googleListener: IGoogleListener,
    @inject(IFileServiceType)
    protected fileService: IFileService
  ) {
    googleListener.initialize();
    super();
  }

  @httpPost("/generate-signed-url")
  public async test(
    @requestBody() requestBody: { fileName: string },
    @response() res: Response
  ) {
    const getSignedUrlResult = await this.fileService.getSignedUrl(
      requestBody.fileName
    );

    if (getSignedUrlResult.isOk()) {
      return this.json({ url: getSignedUrlResult.value });
    }

    throw getSignedUrlResult.error;
  }
}
