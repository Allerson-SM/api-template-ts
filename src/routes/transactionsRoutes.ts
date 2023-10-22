import { Router, Request, Response, NextFunction } from 'express';
import RoutesUtils from './utils/routesUtils';
import ITransactionsService from '../services/transactions/ITransactionsService';

export default class TransactionsRoutes extends RoutesUtils {
    #_router: Router;
    #_service: ITransactionsService;

    constructor(router: Router, service: ITransactionsService) {
        super();

        this.#_router = router;
        this.#_service = service;
        this.configureRoutes();
    }

    async getTransactions(req: Request, res: Response, next: NextFunction) {
        const bodyData = super.getBodyData(req);

        await this.#_service.getTransactions();

        super.success(bodyData);
    }


    configureRoutes() {
        this.#_router.get('/', this.wrapRoute(this.getTransactions));

    }

    get router() {
        return this.#_router;
    }
}