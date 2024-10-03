const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Order = require("../models/order");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((rows) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  const size = +req.query.size || 2;
  let totalProds;

  Product.find()
    .countDocuments()
    .then((numProds) => {
      totalProds = numProds;

      return Product.find()
        .skip((page - 1) * size)
        .limit(size);
    })
    .then((rows) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
        hasProducts: rows.length > 0,
        activeShop: true,
        productCSS: true,
        currentPage: page,
        hasNextPage: size * page < totalProds,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProds / size),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
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
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => req.user.addToCart(product))
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      errorMsg: undefined,
      validate: [],
    });
  });
};

exports.postDeleteItemCart = (req, res, next) => {
  const productId = req.body.id;

  req.user
    .removeFormCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
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
          email: req.user.email,
          userId: req.user,
        },
      });

      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => res.redirect("/orders"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        orders: orders,
        pageTitle: "Orders",
        path: "/orders",
        hasProducts: orders.length > 0,
        activeShop: true,
        productCSS: true,
        errorMsg: undefined,
        validate: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;

  Order.findById(orderId)
    .then((order) => {
      if (!order) return next(new Error("No order found!"));
      if (order.user?.userId.toString() !== req.session.user?._id?.toString())
        return next(new Error("Unauthorized!"));

      const invoiceName = "invoice-" + orderId + ".pdf";
      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoiceName));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("dummy data", {
        underline: true,
      });
      let totalPrice = 0;
      order.products.forEach((p) => {
        totalPrice += p.quantity + p.product.price;
        pdfDoc.text(
          p.product.title + " - " + p.quantity + "x" + "$" + p.product.price
        );
      });
      pdfDoc.text(["----------------"]);
      pdfDoc.fontSize(12).text("Total price: $" + totalPrice);
      pdfDoc.end();
    })
    .catch((err) => next(err));
};
