const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  user: "days_dream_db_user",
  host: "dpg-cfq07gcgqg41dhrsra4g-a",
  database: "days_dream_db",
  password: "kFDYpsVkVqUCixS41ECSwjTiJB4j1WqZ",
  port: 5432,
});

module.exports = pool;
