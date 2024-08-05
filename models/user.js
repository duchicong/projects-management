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
  constructor({ nickname, email, _id, cart }) {
    this.nickname = nickname;
    this.email = email;
    this._id = _id ? new mongoDb.ObjectId(_id) : undefined;
    this.cart = cart;
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

  addToCart(product) {
    let quantity = 1;
    const cartItems = [...(this.cart?.items || [])];
    const existProductInCart = cartItems.findIndex(
      (item) => item.productId.toString() === product._id.toString()
    );

    if (existProductInCart !== -1) {
      quantity = this.cart.items[existProductInCart].quantity + 1;

      cartItems[existProductInCart].quantity = quantity;
    } else {
      cartItems.push({
        productId: new mongoDb.ObjectId(product._id),
        quantity,
      });
    }

    const db = getDb();
    return db
      .collection(TABLE_NAME)
      .updateOne({ _id: this._id }, { $set: { cart: { items: cartItems } } });
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
