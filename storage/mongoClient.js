const debug = require('debug')('storage.index');
const { MongoClient } = require('mongodb');

class Mongo {
  constructor() {
    const url = 'mongodb://db:27017';
    const dbName = 'minesweeper';
    this._init(url, dbName);
    this.db = null;
  }

  _init(url, dbName) {
    // Database Name
    const client = new MongoClient(url, { useUnifiedTopology: true });

    // Use connect method to connect to the server
    client.connect((err) => {
      if (err) throw err;
      debug('Connected successfully to server');
      this.db = client.db(dbName);

      // client.close();
    });
  }
}

module.exports = new Mongo();
