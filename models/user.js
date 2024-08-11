const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: {
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
    role: {
      type: String,
      enum: ["customer", "admin"],
      required: true,
    },
  }
  //   { timestamps: true }
);

const userCollection = mongoose.model("users", userSchema);

module.exports = {
  userCollection,
};
