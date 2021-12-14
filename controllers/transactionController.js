const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const transactionService = require("../services/transaction_service");


exports.setUserIds = (req, res, next) => {
    // Allow nested routes
    
    if (!req.body.from) req.body.from = req.params.userId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
  };

exports.getAllUserTransaction = catchAsync(async (req, res, next) => {
    const transactions = await Transaction.find()
    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: {
        transactions
      }
    });
  });

  exports.getTransaction = catchAsync(async (req, res, next) => {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return next(new AppError('No transaction found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        transaction
      }
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
