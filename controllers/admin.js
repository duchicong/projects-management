const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    product: undefined,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.id;

  Product.findById(productId)
    .then((product) => {
      if (!product) res.redirect("/");

      res.render("admin/add-product", {
        product,
        pageTitle: `Edit ${product?.title || "Product"}`,
        path: `/admin/add-product`,
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

exports.postEditProduct = (req, res, next) => {
  const { id, title, description, imageUrl, price } = req.body;
  if (!id) res.redirect("/admin/products");
  Product.findByIdAndUpdate(id, { title, description, imageUrl, price })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 404;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    // .select("title description -_id")
    // .populate("userId", "nickname")
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Products management",
        path: "/admin/products",
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

exports.postAddProduct = (req, res, next) => {
  const { title, description, imageUrl, price } = req.body;

  new Product({ title, description, imageUrl, price, userId: req.user })
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;

  Product.deleteOne({ _id: id })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      console.log(err);
      res.redirect("/404");
    });
};
