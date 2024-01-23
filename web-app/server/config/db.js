const mysql = require("mysql2");

const dbConfig = {
  host:
    process.env.APP_ENVIRONMENT === "local" ? "localhost" : process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true, // Enable multiple statement support
};

if (process.env.APP_ENVIRONMENT === "local") {
  dbConfig.port = process.env.DB_PORT;
}

const connection = mysql.createConnection(dbConfig);

module.exports = connection;
