const { productCollection } = require("../models/product");

const addProducts = async function (req, res, next) {
  const { name, price, description } = req.body;

  try {
    const product = await productCollection.create({
      productName: name,
      productPrice: price,
      productDesc: description,
    });

    res.status(201).send({
      message: "Product added",
      productName: product.productName,
      _id: product._id,
    });
  } catch (error) {
    next(error);
  }
};

const editProducts = async function (req, res, next) {
  const { id } = req.params;
  const { name, price, description } = req.body;

  try {
    const product = await productCollection.findById(id);
    // || product.addedBy.toString() !== req.user.userId
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    product.productName = name || product.productName;
    product.productPrice = price || product.productPrice;
    product.productDesc = description || product.productDesc;

    await product.save();
    res.status(200).send({
      message: "Product updated",
      productName: product.productName,
      _id: product._id,
    });
  } catch (error) {
    console.log("There was an error: ", error);
    next(error);
  }
};

const viewAllProducts = async function (req, res, next) {
  try {
    const products = await productCollection.find();
    res.status(200).send(products);
  } catch (err) {
    next(err);
  }
};

const viewAProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await productCollection.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
};

const deleteAProduct = async (req, res, next) => {
  //   await productCollection.findByIdAndDelete(req.params.id);
  //   res.send({
  //     message: "Deleted successfully",
  //   });
  // OR

  const { id } = req.params;

  try {
    const product = await productCollection.findById(id);
    // || product.addedBy.toString() !== req.user.userId
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    await product.deleteOne();
    res.status(200).send({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addProducts,
  editProducts,
  viewAllProducts,
  viewAProduct,
  deleteAProduct,
};
