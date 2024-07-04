const fs = require("fs");
const path = require("path");
const dirRoot = require("../util/path");
const Cart = require("./cart");

const pathProduct = path.join(dirRoot, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(pathProduct, (err, fileContent) => {
    if (err) cb([]);
    else cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      let copyProducts = [...products];
      if (this.id) {
        const findIndex = copyProducts.findIndex((p) => p.id === this.id);
        if (findIndex > -1) {
          copyProducts[findIndex] = this;
        }
      } else {
        this.id = Math.random().toString();
        copyProducts.push(this);
      }
      fs.writeFile(pathProduct, JSON.stringify(copyProducts), (err) => {
        console.log("err save ", err);
      });
    });
  }

  static destroy(id) {
    if (!id) return;
    getProductsFromFile((products) => {
      let copyProducts = [...products];
      let existProduct;
      const findIndex = copyProducts.findIndex((p) => p.id === id);
      if (findIndex > -1) {
        existProduct = products[findIndex];
        copyProducts.splice(findIndex, 1);
      }

      fs.writeFile(pathProduct, JSON.stringify(copyProducts), (err) => {
        if (!err && existProduct) Cart.deleteProduct(id, existProduct.price);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findId(id, cb) {
    getProductsFromFile((products) => {
      const existProduct = products.find((item) => item.id === id);
      cb(existProduct);
    });
  }
};
