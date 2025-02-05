const messageList = {
  400: "Bad request",
  401: "Not authorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
};

/**
 * Creating error objects with specific HTTP status codes and messages
 *
 * @param {number} status - status number of error
 * @param {string} message - message of error
 * @returns {Error}
 */
const HttpError = (status, message = messageList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export default HttpError;
