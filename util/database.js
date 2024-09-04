require("dotenv").config();
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.DB_REMOTE)
    .then((client) => {
      console.log("Connected");
      callback(client);
      _db = client.db("shop");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getDb = () => {
  if (_db) return _db;
  throw "No database found!";
};

exports.dbConnect = () => mongoose.connect(process.env.DB_REMOTE);

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
