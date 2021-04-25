const debug = require('debug')('controllers.game');
const { errorHandler } = require('../errors');
const { gameService } = require('../services');

const getState = async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await gameService.getState(id);
    res.json(state);
  } catch (error) {
    debug('error on getState', error);
    errorHandler(error, res, next);
  }
};

const newGame = async (req, res, next) => {
  try {
    const {
      width,
      height,
      percent_of_mines,
    } = req.body;
    const state = await gameService.newGame(width, height, percent_of_mines);
    res.status(201).json(state);
  } catch (error) {
    debug('error on getState', error);
    errorHandler(error, res, next);
  }
};

const addAction = async (req, res, next) => {
  try {
    const {
      row,
      col,
      action,
    } = req.body;
    const { id } = req.params;
    const state = await gameService.addAction(id, row, col, action);
    res.status(201).json(state);
  } catch (error) {
    debug('error on getState', error);
    errorHandler(error, res, next);
  }
};

module.exports = {
  getState,
  newGame,
  addAction,
};
