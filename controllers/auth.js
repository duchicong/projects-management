const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuth: false,
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader("Set-cookie", "loggedIn=true; HttpOnly; Max-age=100000");
  User.findById("66b4ddf6f269d726ffcf68ae")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log("save session err ", err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  // res.setHeader("Set-cookie", "loggedIn=true; HttpOnly; Max-age=100000");
  req.session.destroy(() => {
    res.redirect("/");
  });
};
