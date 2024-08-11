const mongoose = require("mongoose");

const { Types } = require("mongoose");

const userTokenSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const userTokenCollection = mongoose.model("UserToken", userTokenSchema);

module.exports = {
  userTokenCollection,
};
