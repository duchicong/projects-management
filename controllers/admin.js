const Product = require("../models/product");
const fileHelper = require("../util/file");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    product: undefined,
    productCSS: true,
    activeAddProduct: true,
    errorMsg: undefined,
    validate: [],
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
        errorMsg: undefined,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, description, price } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      path: `/admin/add-product`,
      hasProducts: true,
      activeShop: true,
      productCSS: true,
      product: {
        title,
        price,
        description,
      },
      errorMsg: "Attached file is not an image.",
      validationErrors: [],
    });
  }
  if (!id) res.redirect("/admin/products");
  Product.findById(id)
    .then((product) => {
      if (!product || product?.userId?.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      product.title = title;
      product.description = description;
      product.price = price;

      return product.save();
    })
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
  // const errors = validationResult(req);
  const { title, description, imageUrl, price } = req.body;
  const image = req.file;
  console.log("image ", { req, image });

  if (!image) {
    return res.render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      formsCSS: true,
      product: { title, description, price },
      productCSS: true,
      activeAddProduct: true,
      errorMsg: "Attached file is not an image.",
      // validate: errors.array(),
    });
  }

  new Product({
    title,
    description,
    imageUrl: image.path,
    price,
    userId: req.user,
  })
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

  Product.findById(id)
    .then((prod) => {
      if (!prod) return next(new Error("Product not found!"));
      fileHelper.deleteFile(prod.imageUrl);
      return prod.deleteOne({ _id: id });
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => next(err));
};
