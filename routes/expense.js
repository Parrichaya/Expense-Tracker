const express = require('express');
const userAuth = require('../middleware/auth');

const router = express.Router();

const expenseController = require('../controllers/expense');

router.post('/add-expense', userAuth.authenticate, expenseController.addExpense);

router.get('/get-expenses', userAuth.authenticate, expenseController.getExpenses);

router.delete('/delete-expense/:id', userAuth.authenticate, expenseController.deleteExpense);

module.exports = router;