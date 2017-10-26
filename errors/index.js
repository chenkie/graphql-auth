const { createError } = require('apollo-errors');

const AuthorizationError = createError('AuthorizationError', {
  message: 'You are not authorized.'
});

module.exports = { AuthorizationError };
