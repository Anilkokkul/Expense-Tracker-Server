const jwt = require("jsonwebtoken");

exports.authorization = (req, res, next) => {
  const cookies = req.cookies;
  if (cookies.accessToken) {
    const obj = jwt.verify(cookies.accessToken, process.env.SECRET_KEY);
    if (!obj.userId) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    req.userId = obj.userId;
    return next();
  }
  res.status(401).send({
    message: "Not Authenticated need to login",
  });
};
