import pkg, { Pool } from 'pg';
import { SqlConnection } from '../../config/databaseConfig';

export default class PgConnection {
    private pool: Pool;

    constructor(conexao: SqlConnection) {
        const { Pool } = pkg;

        this.pool = new Pool({
            user: conexao.user,
            host: conexao.host,
            database: conexao.database,
            password: conexao.password,
            port: conexao.port,
        });
    }

    async query(query: string, params: Array<string> = []) {
        let client;

        client = await this.pool.connect();
        const result = await client.query(query, params);

        if (client) {
            client.release();
        }

        return result.rows;
    }

}