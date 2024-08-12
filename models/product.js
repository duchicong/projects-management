const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    // tham chieu den model name User
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
// // const sequelize = require("../util/database");
// // const { Sequelize, DataTypes } = require("sequelize");

// // const Product = sequelize.define("product", {
// //   id: {
// //     type: DataTypes.INTEGER,
// //     allowNull: false,
// //     autoIncrement: true,
// //     primaryKey: true,
// //   },
// //   title: {
// //     type: DataTypes.STRING,
// //   },
// //   price: {
// //     type: DataTypes.DOUBLE,
// //     allowNull: false,
// //   },
// //   imageUrl: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //   },
// //   description: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //   },
// // });
// const getDb = require("../util/database").getDb;
// const mongoDb = require("mongodb");
// const TABLE_NAME = "products";

// class Product {
//   constructor({ title, price, description, imageUrl, _id, userId }) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = _id ? new mongoDb.ObjectId(_id) : undefined;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;

//     if (this._id) {
//       dbOp = db
//         .collection(TABLE_NAME)
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection(TABLE_NAME).insertOne(this);
//     }
//     return dbOp
//       .then((result) => result)
//       .catch((err) => {
//         console.log("create product failed ", err);
//       });
//   }

//   static findAll() {
//     const db = getDb();
//     return db
//       .collection(TABLE_NAME)
//       .find()
//       .toArray()
//       .then((data) => data)
//       .catch((err) => {
//         console.log("get products list err ", err);
//         throw err;
//       });
//   }

//   static findById(id) {
//     const db = getDb();
//     const _id = new mongoDb.ObjectId(id);
//     return db
//       .collection(TABLE_NAME)
//       .find({ _id })
//       .next()
//       .then((product) => product)
//       .catch((err) => {
//         console.log("Not found product ", err);
//         throw "ENOTFOUND";
//       });
//   }

//   static deleteById(id) {
//     const db = getDb();
//     const _id = new mongoDb.ObjectId(id);
//     return db
//       .collection(TABLE_NAME)
//       .deleteOne({ _id })
//       .then((product) => product)
//       .catch((err) => {
//         console.log("Not found product ", err);
//         throw "ENOTFOUND";
//       });
//   }
// }

// module.exports = Product;
