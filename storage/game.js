const debug = require('debug')('storages.game');
const { ObjectId } = require('mongodb');
const Mongo = require('./mongoClient');

class Game extends Mongo {
  async getState(id) {
    const db = await this.getConnection();
    // db.client.close();
    return db.collection('games').findOne({ _id: new ObjectId(id) });
  }

  async insertNewGame(data) {
    const db = await this.getConnection();
    const resp = await db.collection('games').insertOne(data);
    return resp.insertedId;
  }

  async upateGame(id, data) {
    const db = await this.getConnection();
    const resp = await db.collection('games').updateOne({ _id: new ObjectId(id) }, { $set: { ...data } });
    return resp;
  }
}

module.exports = new Game();
