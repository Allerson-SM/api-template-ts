# Typescript api template

A simple api template for use as a starting point for a new project.

Still in progress for some improvements and fixes.

The folders are structured as follows:
* `src` - contains the source code
* `test` - contains the tests
* `dist` - contains the compiled code

I built this template like the clean architecture (but not following it at all) and the knowledge i learned with some developers. 
The code is divided in 3 main layers: `routes`, `services` and `data`. I also created some other folders to manage configuration files and handlers. The folders are described below:
 
* The `routes` layer is responsible for the routes. 
* The `services` layer is responsible for the business rules.
* The `data` layer is responsible for the data access. 
* The `config` is responsible for the configuration of some dependencies or packages like the logger. 
* The `handlers` is responsible for the handlers of some errors, like the `BodyNotProvidedError` and the `BadParamError`. 
* The `middlewares` is responsible for the middlewares, like the `bodyParser` and the `cors`. 
* The `infra` is responsible for the connection to the external services like databases and apis.
* The `modules` is responsible for the modules of the application, like the `transactionsModule` and the `usersModule` which have the entire code for this module wrapped in a controller.

In some parts, it works like the NestJs framework. If you want to declare a new controller with the whole code, you need to create a module wich get the dependencies and export the routes, like the example below:

```typescript
import { Router } from "express";
import TransactionsService from "../services/transactions/transactionsService";
import TransactionsRoutes from "../routes/transactionsRoutes";

export default class TransactionsModule {
    #_router;

    constructor(router: Router) {

        const transactionsService = new TransactionsService();
        const transactionsRoutes = new TransactionsRoutes(router, transactionsService);
        this.#_router = transactionsRoutes.router;
    }

    get router() {
        return this.#_router;
    }
}
```

And this code is used in the `controllers.ts` file, like the example below:

```typescript
import { Application, Router } from 'express';
import TransactionsModule from './modules/transactionsModule';

export default class Controllers {

    constructor(app: Application, router: Router) {

        app.use('/api/transactions', new TransactionsModule(router).router);
    }
}
```