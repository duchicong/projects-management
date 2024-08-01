// const sequelize = require("../util/database");
// const { DataTypes } = require("sequelize");

// const User = sequelize.define("user", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   nickname: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: DataTypes.STRING,
// });
const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb;

const TABLE_NAME = "users";
class User {
  constructor({ nickname, email, _id }) {
    this.nickname = nickname;
    this.email = email;
    this._id = _id ? new mongoDb.ObjectId(_id) : undefined;
  }

  save() {
    const db = getDb();
    return db
      .collection(TABLE_NAME)
      .insertOne(this)
      .then((data) => data)
      .catch((err) => {
        console.log("EADDUSER ", err);
        throw "EADDUSER";
      });
  }

  static findById(id) {
    const db = getDb();
    const _id = new mongoDb.ObjectId(id);
    return db
      .collection(TABLE_NAME)
      .findOne({ _id })
      .then((data) => data)
      .catch((err) => {
        console.log("Not exist user!", err);
        throw "EUSERNOTFOUND";
      });
  }
}

module.exports = User;
