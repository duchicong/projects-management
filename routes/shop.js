const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/delete", shopController.deleteProduct);
router.get("/products/:id", shopController.getDetail);
// router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);
router.get("/orders", shopController.getOrders);
router.post("/create-order", shopController.postOrder);
router.get("/checkout", shopController.getCheckout);
router.post("/cart-delete-item", shopController.postDeleteItemCart);

module.exports = router;
