require("dotenv").config();
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.DB_CONNECT)
    .then((client) => {
      console.log("Connected");
      callback(client);
      _db = client.db();
    })
    .catch((err) => console.log(err));
};

module.exports = mongoConnect;
