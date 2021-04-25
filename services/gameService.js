const debug = require('debug')('services.game');

const getState = () => ({ message: 'ok' });

module.exports = {
  getState,
};
