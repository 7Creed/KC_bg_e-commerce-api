const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const cartOrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  //   createdAt: { type: Date, default: Date.now },
});

const cartOrderCollection = mongoose.model("cartOrder", cartOrderSchema);

module.exports = {
  cartOrderCollection,
};
