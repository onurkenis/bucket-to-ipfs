import http from "http";
import https from "https";

import { Application } from "express";
import { ResultAsync } from "neverthrow";

export interface IExpressProvider {
  getApp(): ResultAsync<Application, never>;
  getServer(): ResultAsync<https.Server | http.Server, never>;
  updateApp(app: Application): ResultAsync<void, never>;
}

export const IExpressProviderType = Symbol.for("IExpressProvider");
