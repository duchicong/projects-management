const bcrypt = require("bcryptjs");
const User = require("../models/user");

const SALT = bcrypt.genSaltSync(10);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  console.log("mess ", message);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMsg: message[0],
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader("Set-cookie", "loggedIn=true; HttpOnly; Max-age=100000");
  const { email, password } = req.body;

  if (!password) return res.redirect("/login");

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password!");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
              console.log("save session err ", err);
              res.redirect("/");
            });
          } else {
            req.flash("error", "Invalid email or password!");
            return res.redirect("/login");
          }
        })
        .catch((err) => {
          console.log("Login err ", err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getRegister = (req, res, next) => {
  let message = req.flash("error");
  res.render("auth/register", {
    pageTitle: "Register",
    path: "/register",
    errorMsg: message[0],
  });
};

exports.postRegister = (req, res, next) => {
  const { email, nickname, password } = req.body;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          "error",
          "Email exists already, please pick a defferent one!"
        );
        return res.redirect("/register");
      }
      return bcrypt
        .hash(password, SALT)
        .then((hashedPwd) => {
          const user = new User({
            email,
            nickname,
            password: hashedPwd,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => res.redirect("/login"))
        .catch((err) => err);
    })
    .catch((err) => console.log("Register user err ", err));
};
