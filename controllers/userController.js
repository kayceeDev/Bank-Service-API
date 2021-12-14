const User = require('./../models/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().populate('transactions','account_number');
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has not been implemented yet'
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has not been implemented yet'
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has not been implemented yet'
  });
};

const deleteUser =  catchAsync(async(req, res,next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
});


const disableUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });
  res.status(200).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  disableUser
};
