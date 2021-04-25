const debug = require('debug')('services.game');
const { v4: uuidv4 } = require('uuid');
const Minesweeper = require('../lib/MineSweeper');

const { gameStorage } = require('../storage');

const getState = (id) => gameStorage.getState(id);

const newGame = async (width, height, percentOfMines) => {
  debug('creating new game');
  const minesweeperInst = new Minesweeper(width, height, percentOfMines);
  const data = minesweeperInst.state;
  debug(data.width, data.height, data.numberOfMines);
  const insertedId = await gameStorage.insertNewGame({
    ...data,
    actions: [],
  });
  return { insertedId };
};

const addAction = async (id, row, col, action) => {
  const state = await gameStorage.getState(id);

  if (state.gameOver) throw new Error('Game Over');

  state.actions.push({ action, row, col });
  // build from data;
  const minesweeperInst = new Minesweeper(null, null, null, state);

  await gameStorage.upateGame(id, { ...state });

  const stateUpdated = await gameStorage.getState(id);
  return stateUpdated;
};

module.exports = {
  getState,
  newGame,
  addAction,
};
