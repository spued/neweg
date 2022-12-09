const mongoose = require('mongoose');
const logger = require('../../lib/logger');

const dbName = 'aarx_db';
if (!process.env.MONGODB_ENDPOINT) 
  logger.error('invalid mongodb conf');

let endpoint = `mongodb://${process.env.MONGODB_ENDPOINT}`;
if (endpoint[endpoint.length - 1] !== '/') endpoint += '/';
endpoint += `${dbName}?authSource=admin`;
//console.log('DB uri = ' + endpoint)
mongoose.connect(endpoint, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.MONGODB_USERNAME,
  pass: process.env.MONGODB_PASSWORD,
});

mongoose.set('useFindAndModify', false);

const db = mongoose.connection;

db.on('error', (e) => logger.error(e));
db.once('open', () => {
  logger.info('Connected to Database');
});

module.exports = { mongoose };
