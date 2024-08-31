const Expense = require('../models/expense');
const FileDownloaded = require('../models/filedownloaded');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');
const UserServices = require('../services/userservices');
const S3Service = require('../services/S3services');

// Add an expense from the database and update total expenses
exports.addExpense = async (req, res, next) => {
    const t = await req.user.sequelize.transaction();
    try {
        const date = req.body.date;
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const newExpense = await req.user.createExpense({
            date: date,
            amount: amount,
            description: description,
            category: category
        }, { transaction: t });

        if (amount <= 0) {
            throw new Error('Amount must be greater than zero.');
        }
        await req.user.increment({ totalExpenses: parseInt(amount) }, { transaction: t });

        await t.commit();
        console.log('Expense added and total expenses updated!');
        res.status(201).json({ newExpenseDetail: newExpense });
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: 'An error occurred.' });
    }
};


// Get all expenses from the database
exports.getExpenses = async (req, res, next) => {
    try {        
        const itemsPerPage = parseInt(req.query.limit) || 3;        
        const currentPage = parseInt(req.query.page) || 1;
        const { count, rows: expenses } = await Expense.findAndCountAll({
            where: { userId: req.user.id }, 
            offset: (currentPage - 1) * itemsPerPage,
            limit: itemsPerPage
        });
        const totalPages = Math.ceil(count / itemsPerPage); 
        // const startIndex = (currentPage - 1) * itemsPerPage;
        // const endIndex = Math.min(startIndex + itemsPerPage, expenses.length);

        // const paginatedExpenses = expenses.slice(startIndex, endIndex);
        res.status(200).json({
            allExpenses: expenses,
            currentPage: currentPage,
            totalPages: totalPages
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred.' });
    }
}

// Delete an expense from the database and update total expenses
exports.deleteExpense = async (req, res, next) => {
    const t = await req.user.sequelize.transaction();
    try {
        const expenseId = req.params.id;
        const expense = await req.user.getExpenses({where: {id: expenseId}});
        if (!expense) {
            throw new Error('Expense not found!');
        }
        const expenseToBeDeleted = expense[0];
        const amount = expenseToBeDeleted.amount;
        await req.user.decrement({ totalExpenses: parseInt(amount) }, { transaction: t });
        await expenseToBeDeleted.destroy({ transaction: t });
        await t.commit();
        console.log('Expense deleted and total expenses updated!');
        res.status(200).json({deletedExpense: expenseId});
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: 'An error occurred.' });
    }
}


exports.downloadFile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const expenses = await UserServices.getExpenses(req);
        const data = JSON.stringify(expenses);
        const filename = `expenses${userId}${new Date()}.txt`;
        const fileURL = await S3Service.uploadToS3(data, filename);
        await FileDownloaded.create({
            fileURL: fileURL,
            userId: userId
        });
        res.status(200).json({fileURL: fileURL});
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err, error: 'Failed to download' });
    }
}