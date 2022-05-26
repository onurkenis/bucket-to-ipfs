import {
  GoogleBucketRepository,
  IPFSRepository,
  PersonRepository,
} from "@implementations/data/repositories";
import {
  IFileService,
  IFileServiceType,
  IPersonService,
  IPersonServiceType,
} from "@interfaces/business";
import {
  IBucketRepository,
  IBucketRepositoryType,
  IIPFSRepository,
  IIPFSRepositoryType,
  IPersonRepository,
  IPersonRepositoryType,
} from "@interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
  IExpressProvider,
  IExpressProviderType,
  IPrismaProvider,
  IPrismaProviderType,
} from "@interfaces/utilities";
import {
  ConfigProvider,
  ExpressProvider,
  PrismaProvider,
} from "@implementations/utilities";
import {
  IGoogleListener,
  IGoogleListenerType,
} from "@interfaces/api/listeners";
import { GoogleListener } from "@implementations/api/listeners";
import { FileService, PersonService } from "@implementations/business/services";

import { ContainerModule, interfaces } from "inversify";

export const appModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind
  ) => {
    bind<IPersonRepository>(IPersonRepositoryType)
      .to(PersonRepository)
      .inSingletonScope();
    bind<IBucketRepository>(IBucketRepositoryType)
      .to(GoogleBucketRepository)
      .inSingletonScope();
    bind<IIPFSRepository>(IIPFSRepositoryType)
      .to(IPFSRepository)
      .inSingletonScope();

    bind<IGoogleListener>(IGoogleListenerType)
      .to(GoogleListener)
      .inSingletonScope();

    bind<IFileService>(IFileServiceType).to(FileService).inSingletonScope();
    bind<IPersonService>(IPersonServiceType)
      .to(PersonService)
      .inSingletonScope();

    bind<IExpressProvider>(IExpressProviderType)
      .to(ExpressProvider)
      .inSingletonScope();
    bind<IConfigProvider>(IConfigProviderType)
      .to(ConfigProvider)
      .inSingletonScope();
    bind<IPrismaProvider>(IPrismaProviderType)
      .to(PrismaProvider)
      .inSingletonScope();
  }
);
