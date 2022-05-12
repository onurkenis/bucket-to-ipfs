import { PersonService } from "@implementations/business/services";
import { PersonRepository } from "@implementations/data/repositories";
import { IPersonService, IPersonServiceType } from "@interfaces/business";
import { IPersonRepository, IPersonRepositoryType } from "@interfaces/data";
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
