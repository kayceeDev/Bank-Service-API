const express = require("express");
// const User = require("../models/userModel");
// const userController = require('./../controllers/userControllers');
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

const transactionController = require("./../controllers/transactionController");
router.use(authController.protect);


router
  .route("/")
  .get(transactionController.getAllUserTransaction)
  .post(
    authController.restrictTo("user", "admin"),
    transactionController.createTransaction
  );

  router
  .route('/:id')
  .get(transactionController.getTransaction)

module.exports = router;
