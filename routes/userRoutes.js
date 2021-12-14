const express = require("express");
// const userController = require('./../controllers/userControllers');
const authController = require("./../controllers/authController");
const transactionRouter = require("./transactionRoutes");
const router = express.Router();

const {
  getAllUsers,
  updateUser,
  createUser,
  deleteUser,
  getUser,
  disableUser,
} = require("../controllers/userController");

router.use("/:userId/transactions", transactionRouter);

router.post(
  "/signup",
  authController.protect,
  authController.restrictTo("admin"),
  authController.signup
);
router.post("/login", authController.login);

router.delete("/suspend-user/:id", authController.protect, disableUser);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("user", "admin"),
    getAllUsers
  )
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    deleteUser
  );

module.exports = router;
