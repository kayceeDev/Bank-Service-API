const express = require("express");
// const userController = require('./../controllers/userControllers');
const authController = require("./../controllers/authController");

const router = express.Router();

const {
  getAllUsers,
  updateUser,
  createUser,
  deleteUser,
  getUser,
  suspendUser,
} = require("../controllers/userController");

router.post(
  "/signup",
  authController.protect,
  authController.restrictTo("admin"),
  authController.signup
);
router.post("/login", authController.login);

router.delete("/suspend-user/:id", authController.protect, suspendUser);

router
  .route("/")
  .get(getAllUsers)
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
