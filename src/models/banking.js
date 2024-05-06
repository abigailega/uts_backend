const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');
const bankUsersSchema = require('./bankUsers-schema');

// Kode koneksi MongoDB
mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

// Menggunakan bankUsersSchema untuk mendefinisikan model
const BankingUser = mongoose.model(
  'bankingUsers',
  mongoose.Schema(bankUsersSchema)
);

module.exports = {
  mongoose,
  BankingUser,
};
