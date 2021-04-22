class MineSweeper {
  constructor(width, height, NumberOfMines) {
    this.width = width;
    this.height = height;
    this.NumberOfMines = NumberOfMines;
    this.gameOver = false;
  }

  init() {
    this.buildGrid();
    this.addMines();
    // this.countMinesAround();
  }

  buildGrid() {
    this.grid = [...Array(this.width)].map(() => Array(this.width).fill('#'));
  }

  countMinesAround() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.drawNumbers(i, j, false);
      }
    }
  }

  addMines() {
    for (let i = 0; i <= this.NumberOfMines; i++) {
      const row = Math.floor(Math.random() * this.width);
      const col = Math.floor(Math.random() * this.height);
      this.grid[row][col] = 'X';
    }
  }

  click(row, col) {
    row = Math.abs(row);
    col = Math.abs(col);
    console.log(`clicked on row ${row}, col ${col}`);
    const value = this.grid[row][col];
    if (value === 'X') {
      this.gameOver = true;
      return;
    }

    this.drawNumbers(row, col);
  }

  IsValidMovement(row, col) {
    const ValidRow = this.grid[row];
    if (!ValidRow) return false;
    const ValidCol = this.grid[row][col];
    if (!ValidCol) return false;
    return true;
  }

  review(row, col) {
    if (!this.IsValidMovement(row, col)) {
      return 0;
    }

    console.log(`trying to check - row: ${row}  col: ${col + 1}`);
    let number = 0;
    const val = this.grid[row][col];
    console.log(`checking - row: ${row}  col: ${col + 1} with value: `, val);
    if (val === 'X' || val === 'X checked') {
      number++;
      this.grid[row][col] = 'X checked';
    } else {
      this.grid[row][col] = 'checked';
    }
    return number;
  }

  drawNumbers(row, col, further = true) {
    let number = 0;

    const nodes = [
      // top
      {
        row: row + 1,
        col,
      },
      // bottom
      {
        row: row - 1,
        col,
      },
      // left
      {
        row,
        col: col - 1,
      },
      // right
      {
        row,
        col: col + 1,
      },
      // top left corner
      {
        row: row - 1,
        col: col - 1,
      },
      // top right corner
      {
        row: row - 1,
        col: col + 1,
      },

      // bottom left corner
      {
        row: row + 1,
        col: col - 1,
      },
      // bottom right corner
      {
        row: row + 1,
        col: col + 1,
      },
    ];

    /* for (const node of nodes) {
      number += this.review(node.row, node.col);
    } */

    nodes.forEach((node) => {
      number += this.review(node.row, node.col);
    });

    console.log('number: ', number);
    if (number < 1 && further) {
      // Reveal all adjacent cells as they do not have a mine
      // this.drawNumbers(nodes[0].row, nodes[0].col, false);
      nodes.map((node) => this.drawNumbers(node.row, node.col, false));
    }

    this.grid[row][col] = number;
  }

  printMap() {
    console.table(this.grid);
  }

  isGameOver() {
    return this.gameOver;
  }
}

module.exports = MineSweeper;
