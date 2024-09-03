const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");
const {
  postAddUserService,
  getUserProductsService,
} = require("../Services/user");
const { jwtAuthMiddleware, generateToken } = require("../Middleware/auth");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

//here I am making a user so that I can later validate the route
//and authenticate the user
exports.postAddUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  //Validation on email by express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //we have errors
    //console.log(errors);
    return res.status(422).send("Validation failed");
  }
  //ADD VALIDATION FOR EXISTING USER HERE PLEASE
  User.findOne({ email: email })
    .then((existingUser) => {
      if (!existingUser) {
        //console.log(password);
        return postAddUserService({ name, email, password });
      } else {
        res.status(409).send("User Already Exists!");
      }
    })
    .then((result) => {
      console.log(result); //total data here
      const payload = { id: result.id, name: result.name }; // id of the user returned
      console.log(JSON.stringify(payload)); //testing here, check payload
      const token = generateToken(payload);

      console.log("Token is: ", token);
      res.status(201).json({ result: result, token: token });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send("Failed to create user!");
    });
};

exports.userLogIn = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  //Validation on email by express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //we have errors
    return res.status(422).send("Validation failed");
  }

  //always check user email exsits or not
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).send("Invalid User Email!");
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        //incase of an error
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }
        //in case of difference of password
        if (!isMatch) {
          return res.status(401).send("Invalid Password Entered!");
        }

        //generate token
        const payload = {
          id: user.id,
          email: user.email,
        };
        console.log(payload);
        const token = generateToken(payload);
        //return token here as response
        res.json({ token });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
exports.getUserProducts = (req, res, next) => {
  //user Id
  const userId = req.body._id;
  getUserProductsService(userId)
    .then((result) => {
      if (!result) {
        res.status(404).send("No products added for this user");
      }
      //if products are found
      res.status(200).json({ result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
  console.log();
};
// exports.postAddUser = (req, res, next) => {
//   const name = req.body.name;
//   const email = req.body.email;
//   const password = req.body.password;
//   const product = req.body.product;
//   //ADD VALIDATION FOR EXISTING USER HERE PLEASE
//   User.findOne({ email: email })
//     .then((existingUser) => {
//       if (!existingUser) {
//         const user = new User({
//           name: name,
//           email: email,
//           password: password, //here I am assigning the value I am getting from the user, through req.body to the attributes in my model
//         });
//         user.save();
//       } else {
//         res.status(409).send("User Already Exists!");
//       }
//     })
//     .then((result) => {
//       console.log(result);
//       res.status(201).send("User Created Successfully!");
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(401).send("Failed to create user!");
//     });
// };
