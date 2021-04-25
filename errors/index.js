const debug = require('debug')('errors.index');

class badRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'badRequestError';
  }
}

class notFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'notFoundError';
  }
}

class unauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'unauthorizedError';
  }
}

const errorHandler = (error, res, next) => {
  if (error instanceof notFoundError) return res.boom.notFound(error.message);
  if (error instanceof badRequestError) return res.boom.badRequest(error.message);
  if (error instanceof unauthorizedError) return res.boom.unauthorized(error.message);
  if (error.isAxiosError) {
    debug(JSON.stringify(error.response.data));

    // talkdesk errors
    if (error.response.data.code && error.response.data.code === '0530006') return res.boom.badRequest('Phone number already exist');
    return res.boom.notImplemented(JSON.stringify(error.response.data));
  }

  next(error);
};

module.exports = {
  errorHandler,
  badRequestError,
  notFoundError,
  unauthorizedError,
};
