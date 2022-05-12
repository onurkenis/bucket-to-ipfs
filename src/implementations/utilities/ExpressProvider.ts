import http from "http";
import https from "https";
import path from "path";

import bodyParser from "body-parser";
import express, { Application, NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { IExpressProvider } from "@interfaces/utilities";

@injectable()
export class ExpressProvider implements IExpressProvider {
  protected appResult: ResultAsync<Application, never> | null;
  protected serverResult: ResultAsync<https.Server | http.Server, never> | null;

  constructor() {
    // Setup the HTTPS settings
  }

  public getApp(): ResultAsync<Application, never> {
    if (this.appResult == null) {
      this.appResult = this.initializeApp();
    }

    return this.appResult;
  }

  public getServer(): ResultAsync<https.Server | http.Server, never> {
    if (this.serverResult == null) {
      this.serverResult = this.initializeServer();
    }
    return this.serverResult;
  }

  public updateApp(app: Application): ResultAsync<void, never> {
    this.appResult = okAsync(app);

    return okAsync(undefined);
  }

  protected initializeApp(): ResultAsync<Application, never> {
    const app = express();

    // Set the root for further file ops
    const root = path.normalize(__dirname + "/../../..");

    // Setup the bodyParser stuff so that you can post/put stuff
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || "100kb" }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || "100kb",
      })
    );
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || "100kb" }));

    // Request logging
    // app.use(morgan("combined"));

    // CORS
    // app.use(cors(corsConfig));

    //app.use(cookieParser(process.env.SESSION_SECRET));

    // Host static content
    app.use(express.static(`${root}/public`));

    // Serve the openAPI spec
    const apiSpec = path.join(__dirname, "../../api.yml");

    app.use("/spec", express.static(apiSpec));

    // Error Handling
    app.use(
      (err: any, _req: Request, res: Response, next: NextFunction): void => {
        // l.info("error handler");
        if (res.headersSent) {
          return next(err);
        }
        console.error(err);
        // l.info(err);
        const errors = err.errors || [{ message: err.message }];
        console.error(errors);
        res.status(err.status || 500).json({ errors });
      }
    );

    return okAsync(app);
  }

  protected initializeServer(): ResultAsync<https.Server | http.Server, never> {
    return this.getApp().map((app) => {
      return http.createServer(app);
    });
  }
}
