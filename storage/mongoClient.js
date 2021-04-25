const debug = require('debug')('storages.index');
const { MongoClient } = require('mongodb');

const url = 'mongodb://db:27017';
const dbName = 'minesweeper';

class Mongo {
  async getConnection() {
    // Database Name
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    debug('Connected successfully to server');
    return client.db(dbName);
  }
}

module.exports = Mongo;
