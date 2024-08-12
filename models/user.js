const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity,
    });
  }

  this.cart = { items: cartItems };
  return this.save();
};

userSchema.methods.removeFormCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  this.cart = { items: updatedCartItems };
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// // const sequelize = require("../util/database");
// // const { DataTypes } = require("sequelize");

// // const User = sequelize.define("user", {
// //   id: {
// //     type: DataTypes.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true,
// //   },
// //   nickname: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //   },
// //   email: DataTypes.STRING,
// // });
// const mongoDb = require("mongodb");
// const getDb = require("../util/database").getDb;

// const TABLE_NAME = "users";
// class User {
//   constructor({ nickname, email, _id, cart }) {
//     this.nickname = nickname;
//     this.email = email;
//     this._id = _id ? new mongoDb.ObjectId(_id) : undefined;
//     this.cart = cart;
//   }

//   save() {
//     const db = getDb();
//     return db
//       .collection(TABLE_NAME)
//       .insertOne(this)
//       .then((data) => data)
//       .catch((err) => {
//         console.log("EADDUSER ", err);
//         throw "EADDUSER";
//       });
//   }

//   addToCart(product) {
//     let quantity = 1;
//     const cartItems = [...(this.cart?.items || [])];
//     const existProductInCart = cartItems.findIndex(
//       (item) => item.productId.toString() === product._id.toString()
//     );

//     if (existProductInCart !== -1) {
//       quantity = this.cart.items[existProductInCart].quantity + 1;

//       cartItems[existProductInCart].quantity = quantity;
//     } else {
//       cartItems.push({
//         productId: new mongoDb.ObjectId(product._id),
//         quantity,
//       });
//     }

//     const db = getDb();
//     return db
//       .collection(TABLE_NAME)
//       .updateOne({ _id: this._id }, { $set: { cart: { items: cartItems } } });
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((i) => i.productId);
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         const cartProducts = [...products];
//         return cartProducts.map((p) => {
//           const quantity =
//             this.cart.items.find(
//               (i) => i.productId.toString() === p._id.toString()
//             )?.quantity || 0;

//           return {
//             ...p,
//             quantity,
//           };
//         });
//       })
//       .catch((err) => {
//         console.log("err get cart ", err);
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId.toString()
//     );
//     const db = getDb();
//     return db
//       .collection(TABLE_NAME)
//       .updateOne(
//         { _id: this._id },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           userId: this._id,
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(() => {
//         // update attribute cart inside request.user
//         this.cart = { items: [] };
//         // update db
//         return db
//           .collection(TABLE_NAME)
//           .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
//       })
//       .catch((err) => err);
//   }

//   getOrder() {
//     const db = getDb();
//     return db.collection("orders").find({ userId: this._id }).toArray();
//   }

//   static findById(id) {
//     const db = getDb();
//     const _id = new mongoDb.ObjectId(id);
//     return db
//       .collection(TABLE_NAME)
//       .findOne({ _id })
//       .then((data) => data)
//       .catch((err) => {
//         console.log("Not exist user!", err);
//         throw "EUSERNOTFOUND";
//       });
//   }
// }

// module.exports = User;
