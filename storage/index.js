const debug = require('debug')('storage.index');
const { MongoClient } = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://db:27017';

// Database Name
const dbName = 'minesweeper';
const client = new MongoClient(url, { useUnifiedTopology: true });

// Use connect method to connect to the server
client.connect((err) => {
  assert.equal(null, err);
  debug('Connected successfully to server');

  const db = client.db(dbName);

  client.close();
});
