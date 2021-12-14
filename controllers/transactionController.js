const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

exports.createTransaction = catchAsync(async (req, res, next) => {
  let newTransaction;
  if (!req.body.user) req.body.user = req.user.id;
  if (req.body.transaction_type === "deposit") {
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          account_balance: req.user.account_balance + req.body.amount,
        },
      },
      {
        new: true,
      }
    );
    // await req.user.updateBalance(req.body.amount, "deposit");
    newTransaction = await Transaction.create(req.body);
  } else if (req.body.transaction_type === "transfer") {
    const reciever = await User.findById(req.body.to);
    console.log(reciever)
    if (!reciever) {
      return next(new AppError("No receiver found with that ID", 404));
    } else {
      const newSenderAccountBal = req.user.account_balance - req.body.amount;
      const newRecieverAccountBal = req.body.amount + reciever.account_balance;
      await User.findByIdAndUpdate(
        reciever.id,
        {
          account_balance: newRecieverAccountBal,
        },
        { new: true, runValidators: true }
      );
      await User.findByIdAndUpdate(
        req.user.id,
        {
          account_balance: newSenderAccountBal,
        },
        { new: true, runValidators: true }
      );
      newTransaction = await Transaction.create(req.body);
    }
  }

  res.status(201).json({
    status: "success",
    data: {
      transaction: newTransaction,
    },
  });
});
