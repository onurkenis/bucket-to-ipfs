/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { IPersonService, IPersonServiceType } from "@interfaces/business";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  BaseHttpController,
  requestBody,
  httpGet,
  requestParam,
  httpDelete,
} from "inversify-express-utils";

interface ARequestBody {
  a: string;
  b: string;
}

@controller("/person")
export class AdminController extends BaseHttpController {
  constructor(
    @inject(IPersonServiceType) protected personService: IPersonService
  ) {
    super();
  }

  @httpGet("/test")
  public async test() {
    return this.json({ msg: "test" }, 201);
    /*
    const getSupportedTokensResult = await this.adminService.getSupportedTokens(
      this.userContext
    );

    if (getSupportedTokensResult.isOk()) {
      return this.json({
        supportedTokens: getSupportedTokensResult.value.map(
          (supportedToken) => new SupportedTokenViewModel(supportedToken)
        ),
      });
    }
    
    throw getSupportedTokensResult.error;
    */
  }
}

class AViewModel {
  public a: string;

  constructor(a: string) {
    this.a = a;
  }
}
