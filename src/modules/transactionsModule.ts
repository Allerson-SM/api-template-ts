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