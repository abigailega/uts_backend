const { BankingUser } = require('../../../models/banking'); // Mengimport model BankingUser

/**
 * Get a list of users from the database
 * @returns {Promise<Array>} Array of users
 */
async function getDatas() {
  return BankingUser.find({}); // Menggunakan model BankingUser untuk mengambil daftar pengguna
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return BankingUser.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password, accountNumber) {
  return BankingUser.create({
    name,
    email,
    password,
    accountNumber,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return BankingUser.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return BankingUser.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return BankingUser.findOne({ email });
}

module.exports = {
  getDatas,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  getUser,
};
