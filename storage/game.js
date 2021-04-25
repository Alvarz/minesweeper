const db = require('./mongoClient');

const listCollections = () => db.getCollectionInfos();

module.exports = {
  listCollections,
};
