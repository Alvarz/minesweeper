const { expect } = require('chai');
const sinon = require('sinon');
const { notFoundError, badRequestError } = require('../../errors');
const { gameService } = require('../../services');
const { gameStorage } = require('../../storage');
const Minesweeper = require('../../lib/MineSweeper');

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

describe('Game Service', () => {
  let gameStorageGetState;
  let mineSweeperClick;
  let mineSweeperFlag;
  let gameStorageUpdateGame;

  describe('Perform Action', () => {
    it('should throw an error cause there is no action', async () => {
      try {
        gameService._performAction({}, null, 10, 10);
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
      }
    });

    it('should be called click action', async () => {
      const minesweeperInst = {
        click: sinon.spy(),
        flag: sinon.spy(),
      };
      await gameService._performAction(minesweeperInst, 'click', 10, 10);
      expect(minesweeperInst.click.calledOnce).to.be.true;
      expect(minesweeperInst.flag.calledOnce).to.be.false;
    });

    it('should be called flag action', async () => {
      const minesweeperInst = {
        click: sinon.spy(),
        flag: sinon.spy(),
      };
      await gameService._performAction(minesweeperInst, 'flag', 10, 10);
      expect(minesweeperInst.flag.calledOnce).to.be.true;
      expect(minesweeperInst.click.calledOnce).to.be.false;
    });
  });

  describe('Get State', () => {
    afterEach((done) => {
      gameStorageGetState.restore();
      done();
    });
    it('should fail with a 404 error', async () => {
      gameStorageGetState = sinon.stub(gameStorage, 'getState').returns(null);
      await gameService.getState('itDoesNotExist').catch((err) => {
        expect(err).to.be.instanceOf(notFoundError);
        expect(gameStorageGetState.calledOnce).to.be.true;
      });
    });
    it('should return an object', async () => {
      gameStorageGetState = sinon.stub(gameStorage, 'getState').returns(stateSchema);
      const state = await gameService.getState('itDoesExist');
      expect(state).to.have.property('_id');
      expect(state).to.have.property('grid');
      expect(state).to.have.property('original');
      expect(state).to.have.property('width');
      expect(state).to.have.property('height');
      expect(state).to.have.property('numberOfMines');
      expect(state).to.have.property('gameOver');
      expect(state).to.have.property('victory');
      expect(gameStorageGetState.calledOnce).to.be.true;
    });
  });

  describe('Add Action', () => {
    afterEach((done) => {
      gameStorageGetState.restore();
      done();
    });

    it('should fail with a 404 error', async () => {
      gameStorageGetState = sinon.stub(gameStorage, 'getState').returns(null);
      await gameService.addAction('itDoesNotExist', 0, 0, 'click').catch((err) => {
        expect(err).to.be.instanceOf(notFoundError);
        expect(gameStorageGetState.calledOnce).to.be.true;
      });
    });

    it('should fail because is a victory', async () => {
      gameStorageGetState = sinon.stub(gameStorage, 'getState').returns({ victory: true });
      await gameService.addAction('itShoudBeAVictory', 0, 0, 'click').catch((err) => {
        expect(err).to.be.instanceOf(badRequestError);
        expect(gameStorageGetState.calledOnce).to.be.true;
      });
    });

    it('should fail because is a game over', async () => {
      gameStorageGetState = sinon.stub(gameStorage, 'getState').returns({ gameOver: true });
      await gameService.addAction('itShoudBeAVictory', 0, 0, 'click').catch((err) => {
        expect(err).to.be.instanceOf(badRequestError);
        expect(gameStorageGetState.calledOnce).to.be.true;
      });
    });

    it('should call all the update methods', async () => {
      // console.log(gameService);
      gameStorageGetState = sinon.stub(gameStorage, 'getState').returns(stateSchema);
      mineSweeperClick = sinon.stub(Minesweeper.prototype, 'click').returns(stateSchema);
      mineSweeperFlag = sinon.stub(Minesweeper.prototype, 'flag').returns(stateSchema);
      gameStorageUpdateGame = sinon.stub(gameStorage, 'upateGame').returns(Promise.resolve());

      await gameService.addAction('thisExist', 0, 0, 'click');

      expect(mineSweeperClick.calledOnce).to.be.true;
      expect(mineSweeperFlag.calledOnce).to.be.false;
      expect(gameStorageUpdateGame.calledOnce).to.be.true;
      expect(gameStorageGetState.calledTwice).to.be.true;
    });

    it('should call all the update methods', async () => {
      // console.log(gameService);

      gameStorageGetState.restore();
      mineSweeperClick.restore();
      mineSweeperFlag.restore();
      gameStorageUpdateGame.restore();

      gameStorageGetState = sinon.stub(gameStorage, 'getState').returns(stateSchema);
      mineSweeperClick = sinon.stub(Minesweeper.prototype, 'click').returns(stateSchema);
      mineSweeperFlag = sinon.stub(Minesweeper.prototype, 'flag').returns(stateSchema);
      gameStorageUpdateGame = sinon.stub(gameStorage, 'upateGame').returns(Promise.resolve());

      await gameService.addAction('thisExist', 0, 0, 'flag');

      expect(mineSweeperClick.calledOnce).to.be.false;
      expect(mineSweeperFlag.calledOnce).to.be.true;
      expect(gameStorageUpdateGame.calledOnce).to.be.true;
      expect(gameStorageGetState.calledTwice).to.be.true;
    });
  });

  describe('new game', () => {
    it('should be called', async () => {
      const gameStorageInsertNewGame = sinon.stub(gameStorage, 'insertNewGame').returns(Promise.resolve('thisIsTheId'));
      const { insertedId } = await gameService.newGame(10, 10, 40);
      expect(insertedId).to.exist;
      expect(gameStorageInsertNewGame.calledOnce).to.be.true;
    });
  });
});
