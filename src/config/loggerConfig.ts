import winston, { Logger } from 'winston';
import Transport, { TransportStreamOptions } from 'winston-transport';
import PgConnection from '../infra/database/postgres';
import { DatabaseConfig } from './databaseConfig';

export default class LoggerConfig {

    public logger: Logger;

    constructor() {
        const logFormat = winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => {
                const logMessage = typeof message === 'string' ? message : (message.message || message);
                return `${timestamp} [${level.toUpperCase()}]: ${logMessage}`;
            })
        );

        const logger = winston.createLogger({
            format: logFormat,
            transports: [
                new winston.transports.Console(),
                new PostgresTransport({ level: 'info' }),
            ],
        });

        this.logger = logger;
    }

}

class PostgresTransport extends Transport {
    private client: PgConnection;

    constructor(opts: TransportStreamOptions) {
        super(opts)
        this.client = new PgConnection(DatabaseConfig.getLocalPostgresConfig());
    }

    log(info: any, callback: () => void) {

        const category = info?.category || 'info';

        switch (category) {
            case 'http request':
                this.storeHttpLog(info, callback);
                break;
            case 'info':
                this.storeInfoLog(info, callback);
                break;
            case 'error':
                this.storeErrorLog(info, callback);
                break;
            default:
                this.storeInfoLog(info, callback);
                break;
        }

    }

    storeHttpLog(info: any, callback: () => void) {

        const logEntry = {
            message: info.message,
            method: info.method,
            statusCode: info.statusCode,
            url: info.url,
            clientIp: info.clientIp,
            headers: info.headers,
            contentLength: info.contentLength,
            body: info.body,
            elapsedTime: info.elapsedTime,
        };

        this.client.query(`
                INSERT INTO http_logs(
                    message,
                    method,
                    status_code,
                    url,
                    client_ip,
                    headers,
                    content_length,
                    body,
                    elapsed_time
                    ) VALUES (
                    $1, 
                    $2, 
                    $3, 
                    $4, 
                    $5, 
                    $6, 
                    $7, 
                    $8, 
                    $9
                    )
                `, [logEntry.message, logEntry.method, logEntry.statusCode, logEntry.url, logEntry.clientIp, logEntry.headers, logEntry.contentLength, logEntry.body, logEntry.elapsedTime])
            .then(() => {
                this.emit('logged', info); // Notify Winston that the log entry has been processed
                callback();
            })
            .catch((error) => {
                // Handle errors here
                this.emit('error', error);
                callback();
            });

    }

    storeInfoLog(info: any, callback: () => void) {

        const logEntry = {
            level: info.level,
            message: info.message,
            timestamp: info.timestamp,
        };

        this.client.query('INSERT INTO info_logs(level, message, timestamp) VALUES($1, $2, $3)', [logEntry.level, logEntry.message, logEntry.timestamp])
            .then(() => {
                this.emit('logged', info); // Notify Winston that the log entry has been processed
                callback();
            })
            .catch((error) => {
                // Handle errors here
                this.emit('error', error);
                callback();
            });
    }

    storeErrorLog(info: any, callback: () => void) {
        const logEntry = {
            errorName: info.errorName,
            errorMessage: info.errorMessage,
            errorStack: info.errorStack,
            method: info.method,
            url: info.url,
            headers: info.headers,
            body: info.body,
            clientIp: info.clientIp,
        };

        this.client.query(`
            INSERT INTO error_logs ( 
                error_name, 
                error_message, 
                error_stack, 
                method, 
                url, 
                headers, 
                body, 
                client_ip 
                ) VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8
                )
        `, [logEntry.errorName, logEntry.errorMessage, logEntry.errorStack, logEntry.method, logEntry.url, logEntry.headers, logEntry.body, logEntry.clientIp])
            .then(() => {
                this.emit('logged', info); // Notify Winston that the log entry has been processed
                callback();
            })
            .catch((error) => {
                // Handle errors here
                this.emit('error', error);
                callback();
            });
    }
}