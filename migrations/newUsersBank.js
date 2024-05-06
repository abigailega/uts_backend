const logger = require('../src/core/logger')('api');
const { mongoose, BankingUser } = require('../src/models/banking'); // Mengimpor mongoose dan BankingUser dari banking.js
const { hashPassword } = require('../src/utils/password');

const name = 'Administrator';
const email = 'admin@example.com';
const password = '123456';

logger.info('Creating default users');

function generateAccountNumber() {
  // Fungsi untuk menghasilkan nomor rekening dengan format yang diinginkan
  const prefix = '1799';
  const randomNumber = Math.floor(10000 + Math.random() * 90000); // Angka acak lima digit
  return prefix + randomNumber;
}

(async () => {
  try {
    // Menghitung jumlah pengguna dengan nama dan email yang sama
    const numUsers = await BankingUser.countDocuments({
      name,
      email,
    });

    if (numUsers > 0) {
      throw new Error(`User ${email} already exists`);
    }

    const hashedPassword = await hashPassword(password);
    const accountNumber = generateAccountNumber();

    // Membuat pengguna baru menggunakan model BankingUser
    await BankingUser.create({
      name,
      email,
      password: hashedPassword,
      accountNumber, // Menyimpan nomor rekening dalam data pengguna yang dibuat
    });

    logger.info(`User created with account number: ${accountNumber}`);
  } catch (e) {
    logger.error(e);
  } finally {
    // Menutup koneksi database setelah selesai
    mongoose.connection.close();
    process.exit(0);
  }
})();
