const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["autherization"];
  const authToken = authHeader && authHeader.split(" ")[1];
  if (authToken === null) return res.status(401);

  jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET_KEY, (error, user) => {
    if (error) return res.status(403);
    res.user = user;
    next();
  });
};

module.exports = authenticateToken;
