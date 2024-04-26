const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    console.log(token);
    const user = jwt.verify(token, 'secretkey');
    console.log(user.userId, user.username);
    User.findByPk(user.userId)
    .then((user) => {
        req.user = user;
        next();
    })
    .catch((err) => {
        console.log(err);
        res.status(401).json({error: err});
    })
}

module.exports = {authenticate};