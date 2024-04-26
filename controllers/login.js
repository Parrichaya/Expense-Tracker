const User = require("../models/user");

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

function createToken(id,username) {
    return jwt.sign({userId: id, username: username}, 'secretkey');
}

exports.loginUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({where: {email: email}})
    .then((user) => {
        if(!user) {
            return res.status(404).json({
                message: "User not found!"
            });
        } 
        bcrypt.compare(password, user.password, (err, result) => {
            if(err) {
                return res.status(500).json({
                    message: "Authentication failed!"
                });
            }
            if(!result) {
                return res.status(401).json({
                    message: "Password is incorrect!"
                });
            } else {
                return res.status(200).json({
                    message: "Login Successful!", token: createToken(user.id, user.username)
                })
            }
        })
    })
    .catch(err => console.log(err));
}

exports.checkPremiumStatus = (req, res, next) => {
    try {
        const isPremiumUser = req.user.ispremiumuser;
        res.status(200).json({
            ispremiumuser: isPremiumUser,
            message: "User status retrieved"
        })
    } catch(err) {console.error(err)}
}

