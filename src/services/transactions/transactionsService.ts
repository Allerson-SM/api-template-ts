import ITransactionsService from "./ITransactionsService";

export default class TransactionsService implements ITransactionsService {
    
    getTransactions(): Promise<any> {
        throw new Error("Method not implemented.");
    }

}