const MineSweeper = require('./MineSweeper');

const mineSweeperInst = new MineSweeper(10, 10, 10);

mineSweeperInst.init();
mineSweeperInst.printMap();
mineSweeperInst.click(1, 1);
if (mineSweeperInst.isGameOver()) {
  console.log('GAME OVER');
  process.exit();
}

mineSweeperInst.printMap();
