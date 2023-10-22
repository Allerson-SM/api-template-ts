import { Request, Response, NextFunction } from 'express';
import { BodyNotProvidedError } from '../../handlers/errorsHandlers';

export default class RoutesUtils {

    wrapRoute(fn: Function) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await fn(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    }

    getBodyData(req: Request) {
        if (!req || !req.body || Object.keys(req.body).length === 0) {
            throw new BodyNotProvidedError();
        }

        return req.body;
    }

    getCookiesData(req: Request) {
        if (!req || !req.cookies || Object.keys(req.cookies).length === 0) {
            throw new Error("Cookies not provided");
        }

        return req.cookies;
    }

    getQueryData(req: Request) {
        if (!req || !req.query || Object.keys(req.query).length === 0) {
            throw new Error("Query not provided");
        }

        return req.query;
    }

    getParamsData(req: Request) {
        if (!req || !req.params || Object.keys(req.params).length === 0) {
            throw new Error("Params not provided");
        }

        return req.params;
    }

    success(responseBody: any) {
        return (res: Response) => {
            res.status(200).send(responseBody);
        }
    }
}