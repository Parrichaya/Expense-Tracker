exports.getExpenses = (req, res, next, where) => {
    return req.user.getExpenses(where)
}

