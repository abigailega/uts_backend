const bankingRepository = require('./banking-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users with additional banking information
 * @returns {Array} Array of objects containing user information
 */
async function getDatas() {
  const bankingUser = await bankingRepository.getDatas(); // Mengambil data dari repository

  const results = [];
  // Iterasi melalui setiap pengguna dan membentuk objek hasil
  for (let i = 0; i < bankingUser.length; i++) {
    const bankUser = bankingUser[i];
    results.push({
      id: bankUser.id,
      name: bankUser.name,
      email: bankUser.email,
      accountNumber: bankUser.accountNumber, // Menambahkan nomor rekening ke hasil
    });
  }
  return results;
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);
  // Generate account number
  const accountNumber = generateAccountNumber();

  try {
    await bankingRepository.createUser(
      name,
      email,
      hashedPassword,
      accountNumber
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await bankingRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await bankingRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await bankingRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await bankingRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Generate account number
 * @returns {string} - Account number
 */
function generateAccountNumber() {
  const prefix = '1799';
  const randomNumber = Math.floor(10000 + Math.random() * 90000); // Five-digit random number
  return prefix + randomNumber;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const BankingUser = await bankingRepository.getUserByEmail(email);

  if (BankingUser) {
    return true;
  }

  return false;
}

module.exports = {
  getDatas,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
};
