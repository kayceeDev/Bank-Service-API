// const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

userSchema = {
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
  account_details: {
    acccount_number: String,
    account_balance: Number,
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
};

userSchema.pre("save", async function(next) {
  // only run this function is password was modified
  if (!this.isModified("password")) return next();
  //hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
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

const User = mongoose.model("User", userSchema);

module.exports = User;
