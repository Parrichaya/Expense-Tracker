const express = require('express');
const userAuth = require('../middleware/auth');

const router = express.Router();

const purchaseController = require('../controllers/purchase');

router.get('/premiummembership', userAuth.authenticate, purchaseController.purchasepremium);

router.post('/updatetransactionstatus', userAuth.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;