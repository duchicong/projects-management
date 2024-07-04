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

  Product.findId(productId, (product) => {
    if (!product) res.redirect("/");

    res.render("admin/add-product", {
      product,
      pageTitle: `Edit ${product?.title || "Product"}`,
      path: `/admin/add-product`,
      hasProducts: true,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.postEditProduct = (req, res) => {
  const { id, title, description, imageUrl, price } = req.body;
  const updateProduct = new Product(id, title, imageUrl, description, price);
  updateProduct.save();
  res.redirect("/admin/products");
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Products management",
      path: "/admin/products",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, description, imageUrl, price } = req.body;
  const product = new Product(undefined, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.postDeleteProduct = (req, res) => {
  const id = req.body.id;

  Product.destroy(id);
  res.redirect("/admin/products");
};
