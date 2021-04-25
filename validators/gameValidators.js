const Joi = require('@hapi/joi');

const newGame = Joi.object({
  width: Joi.number().required(),
  height: Joi.number().required(),
  percent_of_mines: Joi.number().required(),
});

const addAction = Joi.object({
  col: Joi.number().required(),
  row: Joi.number().required(),
  action: Joi.string().required().valid('click', 'flag'),
});

module.exports = {
  newGame,
  addAction,
};
