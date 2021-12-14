const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const transactionService = require("../services/transaction_service");
const filterObj = require("../utils/filterFields");

exports.setUserIds = (req, res, next) => {
  // Allow nested routes

  if (!req.body.from) req.body.from = req.params.userId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllUserTransaction = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find();
  res.status(200).json({
    status: "success",
    results: transactions.length,
    data: {
      transactions,
    },
  });
});

exports.getTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return next(new AppError("No transaction found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.createTransaction = catchAsync(async (req, res, next) => {
  let newTransaction;
  if (req.body.transaction_type === "deposit") {
    const newTotal = req.user.account_balance + req.body.amount;
    transactionService.updateUserBalance(req.user.id, newTotal);
    newTransaction = await Transaction.create(req.body);
  } else if (req.body.transaction_type === "transfer") {
    const reciever = await User.findById(req.body.to);
    if (!reciever) {
      return next(new AppError("No receiver found with that ID", 404));
    } else {
      const newSenderAccountBal = req.user.account_balance - req.body.amount;
      const newRecieverAccountBal = req.body.amount + reciever.account_balance;
      transactionService.updateUserBalance(req.user.id, newSenderAccountBal);
      transactionService.updateUserBalance(reciever.id, newRecieverAccountBal);
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

exports.updateTransaction = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "user", "to", "from");

  // 3) Update user document
  const updatedTransaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      transaction: updatedTransaction,
    },
  });
});

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);
  if (!transaction) {
    return next(new AppError("No transaction found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.reverseTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  if (transaction.status === "failed") {
    return next(
      new AppError("transaction found with this ID already reversed", 404)
    );
  }
  if (!transaction) {
    return next(new AppError("No transaction found with that ID", 404));
  }
  await Transaction.findByIdAndUpdate(transaction.id, { status: "failed" });
  const reciever = await User.findById(transaction.to);
  const sender = await User.findById(transaction.from);
  if (!reciever || !sender) {
    return next(
      new AppError("record not found for sender or reciever with that ID", 404)
    );
  }
  const newSenderAccountBal = sender.account_balance + transaction.amount;
  const newRecieverAccountBal = reciever.account_balance - transaction.amount;
  transactionService.updateUserBalance(sender.id, newSenderAccountBal);
  transactionService.updateUserBalance(reciever.id, newRecieverAccountBal);
  res.status(201).json({
    status: "success",
    data: {
      transaction,
    },
  });
});
