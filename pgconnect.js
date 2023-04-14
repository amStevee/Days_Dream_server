const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "127.0.0.1",
  database: process.env.PGDATABASE || "daydreamblog",
  password: process.env.PGPASSWORD || "793254",
  port: process.env.PGPORT || 5432,
});

module.exports = pool;
