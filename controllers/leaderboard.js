const User = require("../models/user");
const Expense = require("../models/expense");

const sequelize = require("../util/database");

exports.getUserLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.findAll({        
            order: [['totalExpenses', 'DESC']], 
        });

        res.status(200).json({ leaderboard });
    } catch (err) {
        console.error(err);
    }
}