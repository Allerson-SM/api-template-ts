import { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { Logger } from 'winston';


export default class Middlewares {

    static preControllers(app: Application, logger: Logger) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use((req: Request, res: Response, next: NextFunction) => {
            const startTime = Date.now();

            res.on('finish', () => {
                const endTime = Date.now();
                const elapsedTime = endTime - startTime;

                const contentLength = res.get('Content-Length') || 0;

                const message: String = `${req.method} ${req.originalUrl} ${res.statusCode} ${req.socket.remoteAddress} ${contentLength} ${elapsedTime}ms`;

                logger.info({
                    message: message,
                    category: "http request",
                    method: req.method,
                    statusCode: res.statusCode,
                    url: req.originalUrl,
                    clientIp: req.socket.remoteAddress,
                    headers: req.headers,
                    contentLength: contentLength,
                    body: req.body,
                    elapsedTime: elapsedTime,
                });
            });

            next();
        });
    }

    static postControllers(app: Application, logger: Logger) {
        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

            logger.error({
                errorName: err.name,
                message: err.stack,
                errorMessage: err.message,
                errorStack: err.stack,
                category: "error",
                method: req.method,
                url: req.originalUrl,
                headers: req.headers,
                body: req.body,
                clientIp: req.socket.remoteAddress,
            });

            res.status(500).send({ error: "Internal Server Error" });
        });
    }
}