import "reflect-metadata";

import { Container } from "inversify";

import { ExpressServer } from "@implementations/server";
import { appModule } from "@implementations/modules";
import { IInjectionContainerType } from "@interfaces/utilities";

// Set up the container
const container = new Container();

// Set up bindings
container.load(appModule);

// Bind the container to itself
container.bind<Container>(IInjectionContainerType).toConstantValue(container);

// TODO: get the port from env variable
new ExpressServer(container).listen(3000);
