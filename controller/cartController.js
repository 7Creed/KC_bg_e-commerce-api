const { cartOrderCollection } = require("../models/cartOrder");
const { productCollection } = require("../models/product");

const addCart = async (req, res, next) => {
  const { items } = req.body;
  //   const customer = req.user.userId;
  try {
    let totalAmount = 0;

    const detailedItems = [];

    for (const item of items) {
      const product = await productCollection.findById(item.productId);
      if (!product) {
        return res.status(400).send({ message: "Invalid product ID" });
      }
      totalAmount += product.productPrice * item.quantity;

      detailedItems.push({
        productId: product._id,
        productName: product.productName,
        productPrice: product.productPrice,
        quantity: item.quantity,
      });
    }

    const order = new cartOrderCollection({
      customer: req.user.userId,
      items: detailedItems,
      totalAmount,
    });

    await order.save();

    res.status(201).send({ order, message: "Order created" });
  } catch (err) {
    // console.log("naso ", err);
    next(err);
  }
};

module.exports = {
  addCart,
};
