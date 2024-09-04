const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const SALT = bcrypt.genSaltSync(10);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "duconggpdg@gmail.com",
    pass: "fzvb tfmk raec vxdd",
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMsg: message[0],
    validate: [],
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader("Set-cookie", "loggedIn=true; HttpOnly; Max-age=100000");
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty())
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMsg: undefined,
      validate: errors.array(),
    });

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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/register", {
      pageTitle: "Register",
      path: "/register",
      errorMsg: errors.array(),
    });
  }

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
        .then(() => {
          transporter.sendMail({
            to: email,
            from: "duconggpdg@gmail.com",
            subject: "Test send mail",
            html: "<h1>You successfully signed up!</h1>",
          });
          res.redirect("/login");
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  res.render("auth/reset", {
    pageTitle: "Reset password",
    path: "/reset-password",
    errorMsg: message[0],
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("Error random reset pwd: ", err);
      return res.redirect("/reset-passord");
    }
    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset-password");
        }

        user.resetToken = token;
        user.resetTokenExpired = Date.now() + 3600000;

        return user.save();
      })
      .then((user) => {
        transporter.sendMail(
          {
            to: user.email,
            from: "hoangle19991102@gmail.com",
            subject: "Password reset",
            html: `
          <p>You requrested a password reset</p>
          <p>Click this <a href="http://localhost:8080/reset/${token}">link here</a> to set a new password</p>
          `,
          },
          (err) => {
            console.log("is delivered or failed: ", err);
          }
        );
        return res.redirect("/login");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const { token } = req.params;

  // find one user reset token created in day
  User.findOne({ resetToken: token, resetTokenExpired: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");

      if (!user) {
        req.flash("error", "Token is invalid or expired.");
        return res.redirect("/login");
      }

      res.render("auth/new-password", {
        pageTitle: "Update password",
        path: "/reset/" + token,
        errorMsg: message[0],
        userId: user._id.toString(),
        token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const { password, id, passwordToken } = req.body;
  let resetUser;

  if ([password, id, passwordToken].some((i) => !i)) {
    req.flash(
      "error",
      "Oops! Something went wrong and update password is failed!"
    );
    return res.redirect("/login");
  }

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpired: { $gt: Date.now() },
    _id: id,
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Oops! User is not exist!");
        return res.redirect("/login");
      }

      resetUser = user;
      return bcrypt.hash(password, SALT);
    })
    .then((hashedPwd) => {
      resetUser.password = hashedPwd;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpired = undefined;
      return resetUser.save();
    })
    .then(() => {
      req.flash("success", "Your password is updated!");
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
