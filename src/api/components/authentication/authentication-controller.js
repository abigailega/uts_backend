const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const failLoginAttempts = {}; // Simpan jumlah upaya login gagal untuk setiap email user
const durationLockAccount = 30 * 60 * 1000; // Durasi lockout dalam milidetik (30 menit)

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check if email is locked out due to too many failed login attempts
    if (failLoginAttempts[email] && failLoginAttempts[email].count >= 5) {
      const elapsedTime = Date.now() - failLoginAttempts[email].lastAttempt;
      if (elapsedTime < durationLockAccount) {
        // User is still locked out
        const remainingTime = Math.ceil(
          (durationLockAccount - elapsedTime) / 1000
        ); // Remaining time in seconds
        throw errorResponder(
          errorTypes.FORBIDDEN,
          `anda telah mencapai batas maksimal untuk login. silakan coba lagi dalam ${remainingTime} detik.`
        );
      } else {
        // Reset failed login attempts after lockout duration
        delete failLoginAttempts[email];
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Increment failed login attempts count
      failLoginAttempts[email] = {
        count: (failLoginAttempts[email]?.count || 0) + 1,
        lastAttempt: Date.now(),
      };
      const failedAttempts = failLoginAttempts[email].count;
      const lastNotificationTime = new Date(
        failLoginAttempts[email].lastAttempt
      ).toLocaleString();
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `Wrong email or password. kamu telah mencoba sebanyak: ${failedAttempts} times`
      );
    }

    // If login is successful, reset failed login attempts
    delete failLoginAttempts[email];

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
