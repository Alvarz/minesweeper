const debug = require('debug')('lib.minesweeper');
const { clamp } = require('../utils/math');

const gridNode = {
  print: '#',
  value: '0',
  opened: false,
  flagged: false,
};

class MineSweeper {
  constructor(width, height, numberOfMines, data = null) {
    if (data) {
      this.buildFromData(data);
      return;
    }
    this.width = width;
    this.height = height;
    this.numberOfMines = numberOfMines;
    this.gameOver = false;
    this.victory = false;
    this.init();
  }

  buildFromData(data) {
    this.width = data.width;
    this.height = data.height;
    this.numberOfMines = data.numberOfMines;
    this.gameOver = false;
    this.victory = false;
    this.grid = data.grid;
  }

  init() {
    debug('init new game');
    this._buildGrid();
    this._addMines();
    this._countMinesAround();
  }

  _checkState() {
    debug('check states');
    if (this.gameOver) {
      this._revealMines();
      debug('GameOver');
    }
    this._checkLevelCompletion();
    this._printMap(false);
  }

  _checkLevelCompletion() {
    debug('checking level completition');
    let levelComplete = true;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if ((this.grid[i][j].value !== 'X') && (!this.grid[i][j].opened)) levelComplete = false;
      }
    }
    if (levelComplete) {
      this.victory = true;
      this._revealMines();
    }
  }

  _buildGrid() {
    debug('building new grid');
    this.grid = [...Array(this.width)].map(() => Array(this.width).fill(null));
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.grid[i][j] = { ...gridNode };
      }
    }
  }

  _countMinesAround() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this._drawNumbers(i, j);
      }
    }
  }

  _addMines() {
    for (let i = 0; i <= this.numberOfMines; i++) {
      const row = Math.floor(Math.random() * this.width);
      const col = Math.floor(Math.random() * this.height);
      this.grid[row][col].value = 'X';
    }
  }

  get state() {
    return {
      grid: this.grid,
      width: this.width,
      height: this.height,
      numberOfMines: this.numberOfMines,
      gameOver: this.gameOver,
      victory: this.victory,
    };
  }

  flag(row, col) {
    row = Math.abs(row);
    col = Math.abs(col);
    if (this.grid[row][col].opened) return;
    this.grid[row][col].flagged = true;
    this.grid[row][col].print = 'F';
  }

  click(row, col) {
    row = Math.abs(row);
    col = Math.abs(col);
    debug(`clicked on row ${row}, col ${col}`);
    const gNode = this.grid[row][col];
    if (gNode.value === 'X') {
      this.gameOver = true;
      return;
    }
    this.grid[row][col] = {
      ...gNode,
      print: gNode.value,
      opened: true,
    };

    if (gNode.value === 0) {
      // Reveal all adjacent cells as they do not have a mine
      // Recursive Call

      const nodes = this.buildNodesToEvaluate(row, col);
      nodes.forEach((node) => {
        const gNod = this.grid[node.row][node.col];
        if (gNod.value === 0 && !gNod.opened) this.click(node.row, node.col);
        else if (gNod.value !== 0) {
          this.grid[node.row][node.col] = {
            ...gNod,
            print: gNod.value,
            opened: true,
          };
        }
      });
    }
    this._checkState();
  }

  _revealMines() {
    debug('REVAL MINES');
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.grid[i][j].value === 'X') {
          this.grid[i][j].print = this.grid[i][j].value;
        }
      }
    }
  }

  _isValidMovement(row, col) {
    const ValidRow = this.grid[row];
    if (!ValidRow) return false;
    const ValidCol = this.grid[row][col];
    if (!ValidCol) return false;
    return true;
  }

  _review(row, col) {
    if (!this._isValidMovement(row, col)) {
      return 0;
    }

    let number = 0;
    const gNode = this.grid[row][col];
    if (gNode.value === 'X' || gNode.value === 'X checked') {
      number++;
    }
    return number;
  }

  _drawNumbers(row, col) {
    let number = 0;
    if (this.grid[row][col].value === 'X' || this.grid[row][col].value === 'X checked') { return this.grid[row][col].value; }
    const nodes = this.buildNodesToEvaluate(row, col);
    nodes.forEach((node) => {
      number += this._review(node.row, node.col);
    });
    this.grid[row][col].value = number;
  }

  _printMap(print = true) {
    if (!print) return;
    const printable = [...Array(this.width)].map(() => Array(this.width).fill('#'));
    const real = [...Array(this.width)].map(() => Array(this.width).fill('#'));
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        // printable[i][j] = this.grid[i][j].value;
        printable[i][j] = this.grid[i][j].print;
        real[i][j] = this.grid[i][j].value;
      }
    }
    console.table(printable);
  }

  isGameOver() {
    return this.gameOver;
  }

  buildNodesToEvaluate(row, col) {
    return [
      // top
      {
        row: clamp(row + 1, 0, this.width - 1),
        col,
      },
      // bottom
      {
        row: clamp(row - 1, 0, this.width - 1),
        col,
      },
      // left
      {
        row,
        col: clamp(col - 1, 0, this.height - 1),
      },
      // right
      {
        row,
        col: clamp(col + 1, 0, this.height - 1),
      },
      // top left corner
      {
        row: clamp(row - 1, 0, this.width - 1),
        col: clamp(col - 1, 0, this.height - 1),
      },
      // top right corner
      {
        row: clamp(row - 1, 0, this.width - 1),
        col: clamp(col + 1, 0, this.height - 1),
      },

      // bottom left corner
      {
        row: clamp(row + 1, 0, this.width - 1),
        col: clamp(col - 1, 0, this.height - 1),
      },
      // bottom right corner
      {
        row: clamp(row + 1, 0, this.width - 1),
        col: clamp(col + 1, 0, this.height - 1),
      },
    ];
  }
}

module.exports = MineSweeper;
