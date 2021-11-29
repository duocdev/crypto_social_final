const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'crypto-social';

const mongo = {
    getDB: async () => {
        const client = await MongoClient.connect(url);
        return client.db(dbName);
    },
    getCollection: async (collectionName) => {
        const db = await mongo.getDB();
        return db.collection(collectionName);
    }
}

module.exports = mongo;