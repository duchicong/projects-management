const fs = require("fs");
const path = require("path");
const dirRoot = require("../util/path");

const pathProduct = path.join(dirRoot, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(pathProduct, (err, fileContent) => {
    if (err) cb([]);
    else cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(pathProduct, JSON.stringify(products), (err) => {
        console.log("err save ", err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
