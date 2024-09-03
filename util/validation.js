const { body, param } = require("express-validator");

const addProductValidation = [
  body("name").isLength({ min: 3 }),
  body("description").isLength({ min: 5 }),
  body("price").isFloat(),
  body("userId").isMongoId(),
  body("category").isMongoId(),
];

const editProductValidation = [
  body("name").isLength({ min: 3 }).notEmpty(),
  body("description").isLength({ min: 5 }),
  body("price").isFloat(),
  param("id").isMongoId(),
];

const deleteProductValidation = [param("id").isMongoId()];

const getProductByIdValidation = [param("id").isMongoId()];

module.exports = {
  addProductValidation,
  editProductValidation,
  deleteProductValidation,
  getProductByIdValidation,
};
