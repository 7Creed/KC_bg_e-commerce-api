var express = require("express");
const {
  registerUser,
  loginUser,
  resetPassword,
  forgotPassword,
} = require("../controller/authController");
var router = express.Router();

/* POST customer registration. */
router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post("/reset-password", resetPassword);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
