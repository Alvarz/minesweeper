const { expect } = require('chai');
const sinon = require('sinon');
const { notFoundError, badRequestError } = require('../../errors');
const Minesweeper = require('../../lib/MineSweeper');

const buildData = {
  width: 2,
  height: 2,
  grid: [[{
    print: '#',
    value: 1,
    opened: false,
    flagged: false,
  },
  {
    print: '#',
    value: 1,
    opened: false,
    flagged: false,
  }],
  [{
    print: '#',
    value: 1,
    opened: false,
    flagged: false,
  },
  {
    print: '#',
    value: 'X',
    opened: false,
    flagged: false,
  }],

  ],
};

const stateSchema = {
  _id: '',
  grid: [],
  original: [],
  actions: [],
  width: 10,
  height: 10,
  numberOfMines: 40,
  gameOver: false,
  victory: false,
};

describe('Minesweeper', () => {
  let mineSweeperFlag;
  let mineSweeperClick;
  describe('Create grid', () => {
    // mineSweeperFlag = sinon.stub(Minesweeper.prototype, 'flag').returns(stateSchema);
    it('Should create a 10X10 and 40 mines grid', () => {
      const instance = new Minesweeper(10, 10, 40);
      const { state } = instance;
      expect(state.width).to.equal(10);
      expect(state.height).to.equal(10);
      expect(state.numberOfMines).to.equal(40);
    });

    it('Should create a 5X5 and 10 mines grid', () => {
      const instance = new Minesweeper(5, 5, 10);
      const { state } = instance;
      expect(state.width).to.equal(5);
      expect(state.height).to.equal(5);
      expect(state.numberOfMines).to.equal(10);
    });
  });

  describe('ReCreate grid from Data', () => {
    it('Should create a 2X2 grid from data', () => {
      const instance = new Minesweeper(null, null, null, buildData);
      const { state } = instance;
      expect(state.width).to.equal(2);
      expect(state.height).to.equal(2);
      expect(state.grid).to.be.an('array');
      expect(state.grid[0]).to.be.an('array');
      expect(state.grid[0][0]).to.be.an('object');
    });
  });
  describe('Perform Flag', () => {
    it('Expect flag to be true', () => {
      const instance = new Minesweeper(10, 10, 4);
      instance.flag(0, 0);
      const { state } = instance;
      expect(state.grid[0][0].flagged).to.be.true;
    });
  });

  describe('Perform Click', () => {
    it('Expect click to be true', () => {
      const instance = new Minesweeper(10, 10, 4);
      instance.click(0, 0);
      const { state } = instance;
      expect(state.grid[0][0].opened).to.be.true;
    });

    it('Expect click to be true and game to be over', () => {
      const instance = new Minesweeper(null, null, null, buildData);
      instance.click(1, 1);
      const { state } = instance;
      expect(state.gameOver).to.be.true;
    });
  });
});
