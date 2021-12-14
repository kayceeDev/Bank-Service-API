const User = require("../models/userModel");

const transactionService = () => {
  const updateUserBalance = async (id, amt) => {
    await User.findByIdAndUpdate(
      id,
      {
        $set: {
          account_balance: amt,
        },
      },
      {
        new: true,runValidators: true 
      }
    );
  };
  
  return{
      updateUserBalance
  }
};

module.exports = transactionService()
