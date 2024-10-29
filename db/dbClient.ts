import { Pool } from "pg";
import { config } from "dotenv";

config();

class PGPool {
    private pool: Pool;
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.CONNECTION_STRING,
        });
    }

    public getPool() {
        return this.pool;
    }

    public verifyConnection() {
        this.pool.connect().then(
            (res) => {
                res.query("SELECT NOW()").then(
                    (res) => {
                        console.log(res.rows);
                    },
                    (err) => {
                        console.error(err);
                    }
                );
            },
            (err) => {
                console.error(err);
            }
        );
    }
}

const poolInstance = new PGPool();

export { poolInstance };
