const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All products",
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.getDetail = (req, res, next) => {
  const productId = req.params.id;

  Product.findId(productId, (product) =>
    res.render("shop/product-detail", {
      product,
      pageTitle: product.title,
      path: `/products/`,
      hasProducts: true,
      activeShop: true,
      productCSS: true,
    })
  );
};

exports.deleteProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-detail", {
      prods: products,
      pageTitle: "Shop",
      path: "/products/:id",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((prods) => {
      const products = [];
      if (cart || cart?.products?.length) {
        for (product of prods) {
          const cartProd = cart.products.find((prod) => prod.id === product.id);
          if (cartProd) {
            products.push({ ...product, qty: cartProd.qty });
          }
        }
      }

      res.render("shop/cart", {
        products,
        pageTitle: "Your Cart",
        path: "/cart",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
      });
    });
  });
};

exports.postCart = (req, res) => {
  const productId = req.body.productId;
  Product.findId(productId, (product) =>
    Cart.addProduct(product.id, product.price)
  );
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/orders", {
      prods: products,
      pageTitle: "Orders",
      path: "/orders",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.getCheckout = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/checkout", {
      prods: products,
      pageTitle: "Checkout",
      path: "/checkout",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.postDeleteItemCart = (req, res) => {
  const productId = req.body.id;
  Product.findId(productId, (product) => {
    if (product) {
      Cart.deleteProduct(product.id, product.price);
      res.redirect("/cart");
    }
  });
};
