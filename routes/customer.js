var express = require("express");
const {
  viewAProduct,
  viewAllProducts,
} = require("../controller/productController");
const { addCart } = require("../controller/cartController");
const verifyAuth = require("../middleware/verifyAuth");
const rolesAllowed = require("../middleware/roleBasedAuth");

var router = express.Router();

// Middleware
router.use(verifyAuth);
router.use(rolesAllowed(["customer"]));

/* POST customer registration. */
// router.post("/register", registerCustomer);

router.get("/viewAProducts/:id", viewAProduct);
router.get("/viewAllProducts", viewAllProducts);
router.post("/addToCart", addCart);

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
