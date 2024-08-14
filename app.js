const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const User = require("./models/user");

const errorController = require("./controllers/error");

const app = express();
const store = new MongoDBStore({
  uri: process.env.DB_REMOTE,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => err);
});

app.use(authRoutes);
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// app.use(errorController.get404);

// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

/**
 * force: {true} this is alway delete data if has any update of tables: user, product is updated.
 */
// sequelize
//   // .sync({ force: true })
//   .sync()
//   .then((result) => {
//     // console.log(result);
//     return User.findByPk(1);
//   })
//   .then((user) => {
//     if (!user)
//       return User.create({
//         nickname: "cong.du",
//         email: "duconggpdg@gmail.com",
//       });
//     return user;
//   })
//   .then((user) => {
//     return user.createCart();
//   })
//   .then(() => {
//     app.listen(8080);
//   })
//   .catch((err) => console.log(err));
mongoose
  .connect(process.env.DB_REMOTE)
  .then(() => {
    User.findById("66b4ddf6f269d726ffcf68ae").then((user) => {
      if (!user) {
        const user = new User({
          _id: "66b4ddf6f269d726ffcf68ae",
          nickname: "cong.du",
          email: "duconggpdg@gmail.com",
          cart: { items: [] },
        });
        user.save();
      }
    });

    app.listen(8080);
  })
  .catch((err) => {
    console.log("Initial failed!!! ", err);
  });
