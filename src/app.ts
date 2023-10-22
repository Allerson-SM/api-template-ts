import Controllers from './controllers';
import Middlewares from './middlewares/middlewares';

import express, { Application, Router } from 'express';
import { Logger } from 'winston';

export default class App {
    public app: Application;
    #_router: Router;

    constructor(logger: Logger) {
        this.app = express();

        this.#_router = express.Router();

        Middlewares.preControllers(this.app, logger);
        new Controllers(this.app, this.#_router);
        Middlewares.postControllers(this.app, logger);
    }
}