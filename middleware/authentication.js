const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization");
  //   console.log("Authorization >>" + token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const user = jwt.verify(token, "v%#JK2$5dfP!9sL@3gH*ZaE");
    const userData = await userModel.findByPk(user.userId);
    // console.log("user id>>" + userData.id);
    req.user = userData;
    next();
  } catch (err) {
    console.log("Authentication error", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = { authenticate };
