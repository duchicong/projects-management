const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  let quantity = 1;
  const cartItems = [...(this.cart?.items || [])];
  const existProductInCart = cartItems.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  );

  if (existProductInCart !== -1) {
    quantity = this.cart.items[existProductInCart].quantity + 1;

    cartItems[existProductInCart].quantity = quantity;
  } else {
    cartItems.push({
      productId: product._id,
      quantity,
    });
  }

  this.cart = { items: cartItems };
  return this.save();
};

userSchema.methods.removeFormCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  this.cart = { items: updatedCartItems };
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
