const Expense = require('../models/expense');
const { Op } = require("sequelize");

exports.getReport = async (req, res, next) => {
    try {
        const { type } = req.query; 

        if (type === 'daily') {
            const date = req.body.date;
            const expenses = await Expense.findAll({
                where: { date: date, userId: req.user.id },
            });
            return res.status(200).json({ expenses: expenses });
        } else if (type === 'monthly') {
            const month = req.body.month; 

            // Extract the year and month 
            const yearMonth = month.split('-');
            const year = yearMonth[0];
            const monthNum = parseInt(yearMonth[1]);

            // Calculate the start and end dates of the month
            const startDate = `${month}-01`; // Start of the month
            const endDate = new Date(year, monthNum, 0).toISOString().split('T')[0]; // End of the month

            const expenses = await Expense.findAll({
                where: {
                    date: {
                        [Op.between]: [startDate, endDate],
                    },
                    userId: req.user.id,
                },
                raw: true,
            });
            return res.status(200).json({ expenses: expenses }); 
        } else {
            return res.status(400).json({ error: 'Invalid report type' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
