const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");
exports.postAddUserService = (userp) => {
  //any manipulation of data is being done here
  const { name, email, password } = userp;
  const user = new User({
    name: name,
    email: email,
    password: password, //here I am assigning the value I am getting from the user, through req.body to the attributes in my model
  });

  return user.save(); //returns a promise
};
exports.getUserProductsService = (userId) => {
  return Product.find({ userId: userId }); //i can have multiple products with the same userId that's why using find
};
