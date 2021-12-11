
// transaction = {
//     userId: string,
//     transaction_type: ["transfer", "deposit", "withdrawal"],
//     amount: Number,
//     from: userId,
//     to: userId,
//     transaction_date: Date.now(),
//     status: ['failed', 'success'],// default success
// }
// Complaint = {
//     msg: string,
//     transaction_id: string,
//     user_id: string,
//     status: ['approved', 'declined']
// }
// ************************ ADMINSTRATION DETAILS ************************************
/* THE THINGS TO BE DONE BY ADMIN
    1. Add users: users is added to database
    2. Delete users: removed
    3. Reverse transfer transactions: {
        user suppose make complaint : {
           make the complaint route
        }
        admin go implement the complaint: go through every complaint
    }
    4. Disable a user account: user is deactivated 
*/
/* we need 2 auth middlewares
    1. the one user would use;
    2. Admin middleware 
*/
//  utility file for account number generation
//  once account number is generated and it exists run the account number regeneration again;
//  random password generation
//  pin
/* ************** Routes Formation ********************
                 AUTHENTICATION
    1. auth/login : logs user in, no route protection
    2. auth/request_password_reset
                USER
    1. user/update_profile
    2. user/change_password
    3. user/change_pin
    4. user/transfer_complaint
                TRANSACTION
    1. transaction/deposit
    2. transaction/withdrawal
    3. transaction/transfer
                ADMIN_PANEL
    1. admin/create_user : creates users by admin
    2. admin/delete_user
    3. admin/update_user
    4. admin/disable_user
    5. admin/reverse_transfer
*/
//Collapse





//Send a message to walz











