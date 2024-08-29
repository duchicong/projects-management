const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check, checkSchema } = require("express-validator");
const User = require("../models/user");

const schemaValidateLogin = checkSchema({
  email: {
    isEmail: true,
    errorMessage: "E-mail is invalid.",
    isLength: {
      options: { max: 100 },
      errorMessage: "Email is max length is 100 characters",
    },
    query: { trim: true },
    normalizeEmail: { options: { gmail_remove_subaddress: true } },
  },
  password: {
    isLength: {
      options: { max: 100, min: 3 },
      errorMessage: "Password is length from 5 to 100 characters",
    },
    query: { trim: true },
  },
});

router.get("/login", authController.getLogin);
router.post("/login", schemaValidateLogin, authController.postLogin);
router.post("/logout", authController.postLogout);
router.get("/register", authController.getRegister);
router.post("/register", check("email").isEmail(), authController.postRegister);
router.get("/reset-password", authController.getReset);
router.post("/reset-password", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
