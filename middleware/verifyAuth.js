require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ message: "Unauthorized" });
  }
};

module.exports = verifyAuth;
