const express = require("express");

const shopController = require("../controllers/shop");
const middlewareIsAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/delete", middlewareIsAuth, shopController.deleteProduct);
router.get("/products/:id", shopController.getDetail);
router.get("/cart", middlewareIsAuth, shopController.getCart);
router.post("/cart", middlewareIsAuth, shopController.postCart);
router.get("/orders", middlewareIsAuth, shopController.getOrders);
router.post("/create-order", middlewareIsAuth, shopController.postOrder);
router.get("/checkout", middlewareIsAuth, shopController.getCheckout);
router.post(
  "/cart-delete-item",
  middlewareIsAuth,
  shopController.postDeleteItemCart
);

module.exports = router;
