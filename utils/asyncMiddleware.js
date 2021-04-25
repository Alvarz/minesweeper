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

module.exports = {
  asyncMiddleware,
};
