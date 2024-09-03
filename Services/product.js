const Category = require("../models/category");
const Product = require("../models/product");
const User = require("../models/user");

//Create Product
exports.postAddProductService = (productControllerObject) => {
  const { name, description, price, category, images, userId } =
    productControllerObject;
  const imageUrl = images.map((file) => file.path);

  const product = new Product({
    name: name, //const on right side, setting value in db that I get from req.body
    description: description,
    price: price,
    category: category,
    images: imageUrl,
    userId: userId,
  });

  return product.save();
};

//Edit Product
exports.postEditProductService = (productId, productControllerObject) => {
  const { name, description, price, images, userId } = productControllerObject;
  return Product.findById(productId).then((product) => {
    if (!product) {
      throw new Error("Product not found"); //cant resend response, that's why using throw new error
    }
    const imageUrl = images.map((file) => file.path);
    product.name = name;
    product.description = description;
    product.price = price;
    product.images = imageUrl;
    // product.userId = userId;
    return product.save();
  });
};

//Remove Product/Delete
exports.postDeleteProductService = (productId) => {
  return Product.findByIdAndDelete(productId);
};

//Get Products by User ID
exports.getProductsByUserService = (userId) => {
  //find returns an array of documents with the matching id, a user can have more than 1 product added, thus using find
  //using populate because userId is passed as ObjectId, so to get the original userID and then setting which fields to get like email, name of the user
  return Product.find({ userId: userId }).populate("userId", "name email");
};

//Get Product by Category ID
exports.getProductsByCategoryService = (categoryId) => {
  return Product.find({ category: categoryId }).populate("category", "name");
};

//Get All Product
exports.getAllProductsService = () => {
  return Product.find();
};

//Get Product by Product Id
exports.getProductByIdService = (productId) => {
  return Product.findById(productId); //need only 1 product, which has the unique prodID, thus findByID
};
