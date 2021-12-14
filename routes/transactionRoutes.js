const express = require("express");
// const User = require("../models/userModel");
// const userController = require('./../controllers/userControllers');
const authController = require("./../controllers/authController");

const router = express.Router();

const transactionController = require("./../controllers/transactionController");

router.post(
  "/deposit",
  authController.protect,
  authController.restrictTo("user", "admin"),
  transactionController.createTransaction
);

module.exports = router;
