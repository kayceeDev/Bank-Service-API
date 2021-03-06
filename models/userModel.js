// const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "user must have a password"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "please confirm your password"],
      validate: {
        validator: function(val) {
          // works only for post request not put or patch request
          // on Create() and on save()
          return val === this.password;
        },
        message: "password must be the same with the password",
      },
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Enter a valid email"],
    },
      acccount_number: String,
      account_balance: {
        type: Number,
        required: [true, "a user must have a starting balance"],
      },
    personal_pin: Number,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    }, // default user
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordChangedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
userSchema.virtual("transactions", {
  ref: "Transaction",
  foreignField: "user",
  localField: "_id",
});

userSchema.pre("save", async function(next) {
  // only run this function is password was modified
  if (!this.isModified("password")) return next();
  //hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre("save", async function(next) {
  // only run this function is password was modified
  //hash password with cost of 12
  this.acccount_number = Math.floor(
    1000000000 + Math.random() * 9000000000
  ).toString();
  next();
});

userSchema.pre(/^find/, function(next) {
  // this points to the current directory
  this.find({ active: { $ne: false } });
  next();
});

// Instance method. method available in the whole model

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.updateBalance = function(amt, trans_type) {
  console.log('hgdfhdffgfhjdjhdh', typeof amt)
  if (trans_type === "deposit") {
    this.account_balance = this.account_balance - amt;
  } else if (trans_type === "transfer" || trans_type === "withdrawal") {
    console.log('hgdfhdffgfhjdjhdh',this.account_balance - amt)
    this.account_balance = this.account_balance - amt;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
