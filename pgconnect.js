const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "containers-us-west-144.railway.app",
  database: process.env.PGDATABASE || "railway",
  password: process.env.PGPASSWORD || "UdO2wsYNn8Xt8zOfOIMp",
  port: process.env.PGPORT || 7124,
});

module.exports = pool;
