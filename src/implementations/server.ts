import os from "os";

import { IExpressProvider, IExpressProviderType } from "@interfaces/utilities";
import express, { Application, NextFunction, Request, Response } from "express";
import { Container, injectable } from "inversify";
import { InversifyExpressServer, interfaces } from "inversify-express-utils";
import { ResultAsync } from "neverthrow";

import "@implementations/api/person/PersonController";

export class ExpressServer {
  protected server: InversifyExpressServer;

  constructor(protected container: Container) {}

  listen(port: number): ResultAsync<void, Error> {
    const expressProvider =
      this.container.get<IExpressProvider>(IExpressProviderType);

    return expressProvider
      .getApp()
      .andThen((customApp) => {
        this.server = new InversifyExpressServer(
          this.container,
          null,
          null,
          customApp
        );
        this.server.setErrorConfig((app) => {
          app.use(
            (
              err: any,
              _req: Request,
              res: Response,
              next: NextFunction
            ): void => {
              console.error(err.stack);
              res.status(err.status || 500).json({
                error: {
                  status: err.status || 500,
                  message: err.message,
                },
              });
            }
          );
        });

        const app = this.server.build();

        return expressProvider.updateApp(app);
      })
      .andThen(() => {
        return expressProvider.getServer();
      })
      .andThen((server) => {
        return ResultAsync.fromPromise(
          new Promise<void>((resolve) => {
            server.listen(port, () => {
              console.log(
                `Up and running in ${
                  process.env.NODE_ENV || "development"
                } @: ${os.hostname()} on port: ${port}`
              );

              resolve();
            });
          }),
          (e) => e as Error
        );
      });
  }
}
