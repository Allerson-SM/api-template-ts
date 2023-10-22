export class DatabaseConfig {

    static getLocalPostgresConfig(): SqlConnection {
        return {
            host: process.env.LOCAL_PG_HOST || 'localhost',
            port: process.env.LOCAL_PG_PORT ? parseInt(process.env.LOCAL_PG_PORT) : 5432,
            user: process.env.LOCAL_PG_USER || 'postgres',
            password: process.env.LOCAL_PG_PASSWORD || 'postgres',
            database: process.env.LOCAL_PG_DATABASE,
        }
    }

    static getLocalMySqlConfig(): SqlConnection {
        return {
            host: process.env.LOCAL_MYSQL_HOST || 'localhost',
            port: process.env.LOCAL_PG_PORT ? parseInt(process.env.LOCAL_PG_PORT) : 3306,
            user: process.env.LOCAL_MYSQL_USER || 'root',
            password: process.env.LOCAL_MYSQL_PASSWORD || '',
            database: process.env.LOCAL_MYSQL_DATABASE,
        }
    }
}

export type SqlConnection = {
    host?: string,
    port?: number,
    user?: string,
    password?: string,
    database?: string,
}