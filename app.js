require('dotenv').config();
// const config = require('config');
const MineSweeper = require('./MineSweeper');

const mineSweeperInst = new MineSweeper(10, 10, 30);

mineSweeperInst.init();
mineSweeperInst.click(1, 1);

mineSweeperInst.flag(8, 3);
mineSweeperInst.click(8, 3);
