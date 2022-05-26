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

new ExpressServer(container).listen(3001);
