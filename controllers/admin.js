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

exports.getEditProduct = (req, res) => {
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
    .catch((err) => console.log("err ", err));
};

exports.postEditProduct = (req, res) => {
  const { id, title, description, imageUrl, price } = req.body;
  if (!id) res.redirect("/admin/products");
  Product.findById(id)
    .then((product) => {
      if (!product) res.redirect("/");
      product.title = title;
      product.description = description;
      product.imageUrl = imageUrl;
      product.price = price;

      return new Product(product).save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/404");
    });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
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
    .catch((err) => console.log("err ", err));
};

exports.postAddProduct = (req, res, next) => {
  const { title, description, imageUrl, price } = req.body;

  new Product({ title, description, imageUrl, price, userId: req.user._id })
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log("error create product ", err));
};

exports.postDeleteProduct = (req, res) => {
  const id = req.body.id;

  Product.deleteById(id)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      console.log(err);
      res.redirect("/404");
    });
};
