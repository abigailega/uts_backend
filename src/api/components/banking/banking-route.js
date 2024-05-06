const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const bankingController = require('./banking-controller');
const bankingValidator = require('./banking-validator');

const route = express.Router();

// Export sebuah fungsi yang menerima aplikasi Express sebagai parameter
module.exports = (app) => {
  app.use('/banking', route);

  // Tentukan rute
  route.get('/', authenticationMiddleware, bankingController.getDatas);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(bankingValidator.createUser),
    bankingController.createUser
  );

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(bankingValidator.updateUser),
    bankingController.updateUser
  );

  // Delete user
  route.delete('/:id', authenticationMiddleware, bankingController.deleteUser);
};
