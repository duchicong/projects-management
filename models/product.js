// const fs = require("fs");
// const path = require("path");
// const dirRoot = require("../util/path");
// const Cart = require("./cart");
// const db = require("../util/database");

// const pathProduct = path.join(dirRoot, "data", "products.json");

// const getProductsFromFile = (cb) => {
//   fs.readFile(pathProduct, (err, fileContent) => {
//     if (err) cb([]);
//     else cb(JSON.parse(fileContent));
//   });
// };

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute(
//       "INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)",
//       [this.title, this.price, this.description, this.imageUrl]
//     );
//   }

//   static destroy(id) {
//     if (!id) return;
//     getProductsFromFile((products) => {
//       let copyProducts = [...products];
//       let existProduct;
//       const findIndex = copyProducts.findIndex((p) => p.id === id);
//       if (findIndex > -1) {
//         existProduct = products[findIndex];
//         copyProducts.splice(findIndex, 1);
//       }

//       fs.writeFile(pathProduct, JSON.stringify(copyProducts), (err) => {
//         if (!err && existProduct) Cart.deleteProduct(id, existProduct.price);
//       });
//     });
//   }

//   static fetchAll() {
//     return db.execute("select * from products");
//   }

//   static findId(id) {
//     return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
//   }
// };
const sequelize = require("../util/database");
const { Sequelize, DataTypes } = require("sequelize");

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Product;
