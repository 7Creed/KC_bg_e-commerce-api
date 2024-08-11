const rolesAllowed = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    next();
  } else {
    console.error("Error in rolesAllowed middleware:", error);
    res.status(403).send({ message: "Forbidden" });
  }
};

module.exports = rolesAllowed;
