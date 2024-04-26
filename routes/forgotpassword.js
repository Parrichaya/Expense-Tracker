const express = require('express');

const router = express.Router();

const forgotPasswordController = require('../controllers/forgotpassword');

router.post('/forgotpassword', forgotPasswordController.forgotPassword);

router.get('/resetpassword/:id', forgotPasswordController.resetPassword);

router.get('/updatepassword/:id', forgotPasswordController.updatePassword);

module.exports = router;