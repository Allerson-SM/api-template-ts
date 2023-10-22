import { Application, Router } from 'express';
import TransactionsModule from './modules/transactionsModule';

export default class Controllers {

    constructor(app: Application, router: Router) {

        app.use('/api/transactions', new TransactionsModule(router).router);
    }

}