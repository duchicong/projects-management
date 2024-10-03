const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);
router.get("/products/edit/:id", adminController.getEditProduct);
router.post("/products/edit", adminController.postEditProduct);
router.post("/delete-product", adminController.postDeleteProduct);
router.delete("/products/:id", adminController.deleteProduct);
router.get("/products", adminController.getIndex);

// /admin/add-product => POST
router.post(
  "/add-product",
  // [
  //   body("title").isString().isLength({ min: 3 }).trim(),
  //   // body('image').
  //   body("price").isFloat(),
  //   body("description").isLength({ min: 5, max: 400 }).trim(),
  // ],
  adminController.postAddProduct
);

module.exports = router;
