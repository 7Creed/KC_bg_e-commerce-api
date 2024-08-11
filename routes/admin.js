var express = require("express");
const {
  addProducts,
  editProducts,
  viewAllProducts,
  viewAProduct,
  deleteAProduct,
} = require("../controller/productController");
const verifyAuth = require("../middleware/verifyAuth");
const rolesAllowed = require("../middleware/roleBasedAuth");

var router = express.Router();

// Middlewares
router.use(verifyAuth);
router.use(rolesAllowed(["admin"]));

router.post("/addProducts", addProducts);
router.put("/editProducts/:id", editProducts);
router.get("/viewAllProducts", viewAllProducts);
router.get("/viewAProducts/:id", viewAProduct);
router.delete("/deleteAProduct/:id", deleteAProduct);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
