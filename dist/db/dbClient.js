"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolInstance = void 0;
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class PGPool {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: process.env.CONNECTION_STRING,
        });
    }
    getPool() {
        return this.pool;
    }
    verifyConnection() {
        this.pool.connect().then((res) => {
            res.query("SELECT NOW()").then((res) => {
                console.log(res.rows);
            }, (err) => {
                console.error(err);
            });
        }, (err) => {
            console.error(err);
        });
    }
}
const poolInstance = new PGPool();
exports.poolInstance = poolInstance;
