const createError = (status, message, stack) => {
  const error = new Error();
  error.status = status;
  error.message = message;
  error.stack = stack;
  return error;
};

module.exports = createError;
