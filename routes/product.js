const express = require("express");

const productController = require("../controller/product");
const { jwtAuthMiddleware } = require("../Middleware/auth");
const {
  addProductValidation,
  editProductValidation,
  deleteProductValidation,
  getProductByIdValidation,
} = require("../util/validation");
const upload = require("../util/images");

const router = express.Router();

//create a new product
router.post(
  "/add-product",
  upload.array("images", 5),
  addProductValidation,
  jwtAuthMiddleware,
  productController.postAddProducts
);
router.put(
  "/edit-product/:id",
  upload.array("images", 5),
  editProductValidation,
  jwtAuthMiddleware,
  productController.postEditProduct
);
router.delete(
  "/delete-product/:id",
  deleteProductValidation,
  jwtAuthMiddleware,
  productController.postDeleteProduct
);
router.get(
  "/get-product-by-user/:id",
  getProductByIdValidation,
  jwtAuthMiddleware,
  productController.getProductsByUser
);
router.get(
  "/get-product-by-category/:id",
  jwtAuthMiddleware,
  productController.getProductsByCategory
);
router.get(
  "/get-product-by-productId/:id",
  getProductByIdValidation,
  jwtAuthMiddleware,
  productController.getProductByProductId
);
router.get(
  "/get-all-products",
  jwtAuthMiddleware,
  productController.getAllProducts
);
module.exports = router;
