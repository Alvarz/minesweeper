const express = require('express');
const { asyncMiddleware } = require('../utils/asyncMiddleware');
const { gameController } = require('../controllers');

const openDataRouter = express.Router();

openDataRouter.get('/get-state', asyncMiddleware(gameController.getStage));

module.exports = openDataRouter;
