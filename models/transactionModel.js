const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  transaction_type: {
    type: String,
    required: [true, "specify the type of transaction"],
    enum: ["transfer", "deposit", "withdrawal"],
  },
  amount: {
    type: Number,
    required: [true, "Please add amount for transaction"],
    min: 0,

    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: "amount need to be > 0",
    },
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  transaction_date: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  status: {
    type: String,
    default: "success",
  }, // default success
});

// Complaint = {
//     msg: string,
//     transaction_id: string,
//     user_id: string,
//     status: ['approved', 'declined']
// }

transactionSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).

  this.populate({
      path: "from",
      select: "full_name",
    })
    .populate({
      path: "to",
      select: "full_name acccount_number",
    });
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
