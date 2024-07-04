const fs = require("fs");
const path = require("path");
const dirRoot = require("../util/path");
const isEmpty = require("../util/isEmpty");

const pathCart = path.join(dirRoot, "data", "cart.json");

module.exports = class Cart {
  constructor() {
    this.products = [];
    this.totalPrice = 0;
  }

  static addProduct(id, productPrice) {
    // fetch the previous cart
    fs.readFile(pathCart, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(pathCart, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, price) {
    fs.readFile(pathCart, (err, fileContent) => {
      if (err) return;
      const updateCart = JSON.parse(fileContent);
      const findIndexProduct = updateCart.products.findIndex(
        (p) => p.id === id
      );
      const existProduct = updateCart.products[findIndexProduct];
      let priceProduct = 0;
      if (existProduct) {
        priceProduct = existProduct.qty * price;
        updateCart.totalPrice = updateCart.totalPrice - priceProduct;
        updateCart.products.splice(findIndexProduct, 1);
      }

      fs.writeFile(pathCart, JSON.stringify(updateCart), (err) => {
        if (err) console.log("Error update cart >>> ", err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(pathCart, (err, fileContent) => {
      if (err) cb(null);
      else {
        const cart = JSON.parse(fileContent);
        cb(cart);
      }
    });
  }
};
