const express = require("express");
const app = express();

const prodRoutes = require("./product");
const userRoutes = require("./user");

const router = express.Router();

router.use("/pro", prodRoutes);
router.use("/", userRoutes);

module.exports = router;
