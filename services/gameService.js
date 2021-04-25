const debug = require('debug')('services.game');
const Minesweeper = require('../lib/MineSweeper');
const { notFoundError, badRequestError } = require('../errors');

const { gameStorage } = require('../storage');

const getState = async (id) => {
  const state = await gameStorage.getState(id);
  if (!state) throw new notFoundError('Not found game with given id');
  return state;
};

const newGame = async (width, height, percentOfMines) => {
  debug('creating new game');
  const minesweeperInst = new Minesweeper(width, height, percentOfMines);
  const data = minesweeperInst.state;
  debug(data.width, data.height, data.numberOfMines);
  data.original = data.grid;
  const insertedId = await gameStorage.insertNewGame({
    ...data,
    actions: [],
  });
  return { insertedId };
};

const _permformAction = (minesweeperInst, action, row, col) => {
  switch (action) {
  case 'click':
    return minesweeperInst.click(row, col);
  case 'flag':
    return minesweeperInst.flag(row, col);
  default:
    throw new Error('action does not exist');
  }
};

const addAction = async (id, row, col, action) => {
  const state = await gameStorage.getState(id);

  if (state.gameOver || state.victory) throw new badRequestError('Cannot perform action on a finished game');

  state.actions.push({ action, row, col });
  // build from data;
  const minesweeperInst = new Minesweeper(null, null, null, state);
  _permformAction(minesweeperInst, action, row, col);
  const newState = minesweeperInst.state;
  newState.actions = state.actions;
  await gameStorage.upateGame(id, { ...newState });

  const stateUpdated = await gameStorage.getState(id);
  return stateUpdated;
};

module.exports = {
  getState,
  newGame,
  addAction,
};
