const Order = require("../models/order");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((rows) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All products",
        path: "/products",
        isAuth: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log("err ", err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((rows) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
        hasProducts: rows.length > 0,
        activeShop: true,
        productCSS: true,
        isAuth: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log("err ", err));
};

exports.getDetail = (req, res, next) => {
  const productId = req.params.id;

  Product.findById(productId)
    .then((product) => {
      if (!product) res.redirect("/");

      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: `/products/`,
        hasProducts: true,
        activeShop: true,
        productCSS: true,
        isAuth: req.session.isLoggedIn,
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
        isAuth: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log("err ", err));
};

exports.getCart = (req, res, next) => {
  if (!req.user) res.redirect("/login");
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        products,
        pageTitle: "Your Cart",
        path: "/cart",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
        isAuth: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  if (!req.user) res.redirect("/login");
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => req.user.addToCart(product))
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {});
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
      isAuth: req.session.isLoggedIn,
    });
  });
};

exports.postDeleteItemCart = (req, res) => {
  const productId = req.body.id;

  req.user
    .removeFormCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => ({
        quantity: i.quantity,
        product: { ...i.productId._doc },
      }));

      const order = new Order({
        products,
        user: {
          nickname: req.user.nickname,
          userId: req.user,
        },
      });

      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        orders: orders,
        pageTitle: "Orders",
        path: "/orders",
        hasProducts: orders.length > 0,
        activeShop: true,
        productCSS: true,
        isAuth: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
