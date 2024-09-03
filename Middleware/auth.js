const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtAuthMiddleware = (req, res, next) => {
  //check if request headers have authorization or not
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send("Unable to find Token");
  }

  //extract jwt token from the request header
  //splitting with the help of space, bearer token
  //token is in the [1] index
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send("Unathourized!");
  }
  try {
    //verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //attach user information to the request object
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("Invalid Token");
  }
};
//Function to generate JWT token
const generateToken = (userData) => {
  //Generate a new JWT Token using user data
  return jwt.sign(userData, process.env.JWT_SECRET);
};

module.exports = { jwtAuthMiddleware, generateToken };
