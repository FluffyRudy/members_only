const { Pool } = require("pg");
const { config } = require("dotenv");

config();

class PGPool {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.CONNECTION_STRING_PROD,
    });
  }

  getPool() {
    return this.pool;
  }

  verifyConnection() {
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

module.exports = { poolInstance };
