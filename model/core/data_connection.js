const util = require('util')
const mysql = require('mysql')
const logger = require('../../lib/logger');

const db_config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10
};

const pool = mysql.createPool(db_config);

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      logger.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      logger.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      logger.error('Database connection was refused.')
    }
  }

  if (connection) connection.release()
  return
})
// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query)

module.exports = pool
