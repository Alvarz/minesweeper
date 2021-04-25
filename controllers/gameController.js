const debug = require('debug')('controllers.game');
const { errorHandler } = require('../errors');
const { gameService } = require('../services');

const getState = async (req, res, next) => {
  try {
    const openData = await openDataService.fetchOpenData();
    res.json(openData);
  } catch (error) {
    debug('error on GetOpenData', error);
    errorHandler(error, res, next);
  }
};

module.exports = {
  getState,
};
