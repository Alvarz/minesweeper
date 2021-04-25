const debug = require('debug')('errors.validation');

const validatation = (res, validatorSchema, data, req) => {
  const { error } = validatorSchema.validate(data);
  if (error) {
    const { details } = error;
    const message = details.map((i) => i.message).join(',');
    debug(JSON.stringify({
      error: message,
      requestBody: JSON.stringify(data),
      url: req.originalUrl,
    }));

    res.boom.badRequest(message);
    return false;
  }
  return true;
};

const asyncMiddleware = (fn, validatorSchema = null) => (req, res, next) => {
  let valid = true;
  if (validatorSchema !== null) {
    valid = validatation(res, validatorSchema, req.body, req);
  }
  if (valid) {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  }
};

/* const secureAsyncMiddleware = (fn, validatorSchema = null) => async (req, res, next) => {
  try {
    let valid = true;
    await authService.authenticateRequest(req);
    if (validatorSchema !== null) {
      valid = validatation(res, validatorSchema, req.body, req);
    }
    if (valid) {
      Promise.resolve(fn(req, res, next))
        .catch(next);
    }
  } catch (error) {
    errorHandler(error, res, next);
  }
};

const serverToServerSecureAsyncMiddleware = (fn, validatorSchema = null) => async (req, res, next) => {
  try {
    let valid = true;
    await authService.authenticateOauthRequest(req);
    if (validatorSchema !== null) {
      valid = validatation(res, validatorSchema, req.body, req);
    }
    if (valid) {
      Promise.resolve(fn(req, res, next))
        .catch(next);
    }
  } catch (error) {
    errorHandler(error, res, next);
  }
};

const secureAsyncBothAuthMethods = (fn, validatorSchema = null) => async (req, res, next) => {
  try {
    let valid = true;
    await authService.verifyBothAuthMethods(req);
    if (validatorSchema !== null) {
      valid = validatation(res, validatorSchema, req.body, req);
    }
    if (valid) {
      Promise.resolve(fn(req, res, next))
        .catch(next);
    }
  } catch (error) {
    errorHandler(error, res, next);
  }
}; */

module.exports = {
  // serverToServerSecureAsyncMiddleware,
  asyncMiddleware,
  // secureAsyncMiddleware,
  // secureAsyncBothAuthMethods,
};
