const { validationResult } = require("express-validator");
const Category = require("../models/category");
const Product = require("../models/product");
const User = require("../models/user");
const {
  postAddProductService,
  getProductsByCategoryService,
} = require("../Services/product");
const {
  postEditProductService,
  postDeleteProductService,
  getProductsByUserService,
  getAllProductsService,
  getProductByIdService,
} = require("../Services/product");

//create product here
exports.postAddProducts = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const images = req.files; //in postman we have type file that's why it's file
  const userId = req.body.userId;
  const category = req.body.category;
  //console.log(images);

  //validation by express validator
  //collect the errors first
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //getting an array of error objs, using map to iterate over each item
    //map will return a new array containing only the err msg
    const errorMsg = errors.array().map((error) => {
      return { field: error.path, message: error.msg }; //get only the error message here with the field causing it
    });

    console.log(errorMsg);
    return res.status(422).send("Validation failed");
  }

  const productData = postAddProductService({
    name,
    description,
    price,
    category,
    images,
    userId,
  })
    .then((result) => {
      const categoryId = result.category; // i need category id to store product info
      return Category.findById(categoryId.toString())
        .exec() //to get the fields, not the whole object
        .then((categoryData) => {
          if (!categoryData) {
            throw new Error("Category not found");
          }
          return { result, categoryData }; //result has the product created info, category data has the category info, name, id etc
        });
    })
    .then(({ result, categoryData }) => {
      // category ki id in product array
      categoryData.product.push(result._id);
      return categoryData.save(); // Save the updated category
    })
    .then(() => {
      res.status(201).send("Product Added Successfully!");
    })

    .catch((err) => {
      console.log(err);
      res.status(401).send("Failed to Create Product! ");
    });
};

//Edit/Update Product here
exports.postEditProduct = (req, res, next) => {
  //get prodId from the parameter URL, so that we can use it later
  const prodId = req.params.id;
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const images = req.files;
  //   const userId = req.body.userId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //getting an array of error objs, using map to iterate over each item
    //map will return a new array containing only the err msg
    const errorMsg = errors.array().map((error) => {
      return { field: error.path, message: error.msg }; //get only the error message here with the field causing it
    });

    console.log(errorMsg);
    return res.status(422).send("Validation failed");
  }

  const productEditData = postEditProductService(prodId, {
    name,
    description,
    price,
    images,
  })
    .then((result) => {
      res.status(201).json({ message: "Product Updated Successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send("Failed to Update Product");
    });
};

//Delete Product here
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.params.id;

  postDeleteProductService(prodId)
    .then((result) => {
      res.status(201).send("Product Deleted Successfully!");
    })
    .catch((err) => {
      console.log(err);
      res.status(201).send("Failed to Delete Product");
    });
};

//Get Products here by userID
exports.getProductsByUser = (req, res, next) => {
  //get user id so that I can pass this
  const userId = req.params.id;
  getProductsByUserService(userId)
    .then((result) => {
      res.status(201).json({ message: "Product Found Successfully", result });
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(403).send("Failed to get Product");
    });
};

//get Products by Category
exports.getProductsByCategory = (req, res, next) => {
  const categoryId = req.params.id;
  //console.log(categoryId);
  getProductsByCategoryService(categoryId)
    .then((result) => {
      res.status(201).json({ message: "Product Found Successfully", result });
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Failed to get Products");
    });
};
//get Products by Product ID
exports.getProductByProductId = (req, res, next) => {
  const prodId = req.params.id;
  getProductByIdService(prodId)
    .then((result) => {
      res.status(201).json({ message: "Product Found Successfully", result });
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(201).send("Failed to get Product");
    });
};

//get list of all products
exports.getAllProducts = (req, res, next) => {
  getAllProductsService()
    .then((result) => {
      res.status(201).json({ message: "Product Found Successfully", result });
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(201).send("Failed to get Product");
    });
};

// exports.postAddProducts = (req, res, next) => {
//     const name = req.body.name;
//     const description = req.body.description;
//     const price = req.body.price;
//     const images = req.body.images;
//     const userId = req.body.userId;

//     const product = new Product({
//       name: name, //const on right side, setting value in db that I get from req.body
//       description: description,
//       price: price,
//       images: images,
//       userId: userId,
//     });
//     product
//       .save()
//       .then((result) => {
//         //console.log(result);
//         res.status(201).send("Product Added Successfully!");
//       })
//       .catch((err) => {
//         console.log(err);
//         res.status(401).send("Failed to Create Product! ");
//       });
//   };
