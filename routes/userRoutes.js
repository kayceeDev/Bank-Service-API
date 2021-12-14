const express = require("express");
// const userController = require('./../controllers/userControllers');
const authController = require("./../controllers/authController");
const transactionRouter = require("./transactionRoutes");
const router = express.Router();

const userController = require("../controllers/userController");

router.use("/:userId/transactions", transactionRouter);

router.post(
  "/signup",
  authController.protect,
  authController.restrictTo("admin"),
  authController.signup
);
router.post("/login", authController.login);
router.delete(
  "/disable-user/:id",
  authController.protect,
  userController.disableUser
);

router.use(authController.protect);
router.get("/me", userController.getMe, userController.getUser);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("user", "admin"),
    userController.getAllUsers
  )
  .post(authController.restrictTo("admin"), userController.createUser);

router
  .route("/:id")
  .get(authController.restrictTo("user", "admin"), userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser
  );

module.exports = router;
