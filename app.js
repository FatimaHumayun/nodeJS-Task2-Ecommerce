const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const routes = require("./routes/index");

const Category = require("./models/category");

// const MONGO_URL = process.env.MONGO_URL;
// const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //use to parse form data

app.use("/", routes);

//connect schema with Mongoose
mongoose
  .connect("mongodb://localhost:27017/e-commerce")
  .then((result) => {
    Category.find().then((category) => {
      //avoid duplication

      //create an array of objects
      const totalCategories = [
        { name: "Electronics" },
        { name: "MakeUp" },
        { name: "Stationary" },
        { name: "Hardware" },
      ];
      Category.insertMany(totalCategories)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    console.log("Connected Successfully!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
