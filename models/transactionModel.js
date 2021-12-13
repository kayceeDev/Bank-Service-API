transaction = {
    userId: string,
    transaction_type: ["transfer", "deposit", "withdrawal"],
    amount: Number,
    from: userId,
    to: userId,
    transaction_date: Date.now(),
    status: ['failed', 'success'],// default success
}
Complaint = {
    msg: string,
    transaction_id: string,
    user_id: string,
    status: ['approved', 'declined']
}