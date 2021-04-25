const express = require('express');
const { asyncMiddleware } = require('../utils/asyncMiddleware');
const { gameController } = require('../controllers');
const { gameValidator: { newGame, addAction } } = require('../validators');

const gameRouter = express.Router();

gameRouter.post('/', asyncMiddleware(gameController.newGame, newGame));
gameRouter.put('/:id', asyncMiddleware(gameController.addAction, addAction));
gameRouter.get('/:id', asyncMiddleware(gameController.getState));

module.exports = gameRouter;
