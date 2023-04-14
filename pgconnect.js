const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "daydreamblog",
  password: process.env.PGPASSWORD || "93254",
  port: process.env.PGPORT || 5432,
});

module.exports = pool;
