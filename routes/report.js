const express = require('express');
const userAuth = require('../middleware/auth');

const router = express.Router();

const reportController = require('../controllers/report');

router.post('/report', userAuth.authenticate, reportController.getReport);

module.exports = router;