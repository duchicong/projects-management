const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((rows) => {
      res.render("admin/products", {
        prods: rows,
        pageTitle: "All products",
        path: "/products",
      });
    })
    .catch((err) => console.log("err ", err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((rows) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
        hasProducts: rows.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => console.log("err ", err));
};

exports.getDetail = (req, res, next) => {
  const productId = req.params.id;

  Product.findByPk(productId)
    .then((product) => {
      if (!product) res.redirect("/");

      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: `/products/`,
        hasProducts: true,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => console.log("err ", err));
};

exports.deleteProduct = (req, res, next) => {
  Product.findAll()
    .then((rows) => {
      res.render("shop/product-detail", {
        prods: rows,
        pageTitle: "Shop",
        path: "/products/:id",
        hasProducts: rows.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => console.log("err ", err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.findAll((prods) => {
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
  Product.findAll((products) => {
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
