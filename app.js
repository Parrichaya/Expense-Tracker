const express = require('express');
const app = express();
const helmet = require('helmet');

require('dotenv').config();

const sequelize = require('./util/database');
const morgan = require('morgan');

const path = require('path');
const fs = require('fs');

const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let cors = require('cors');
app.use(cors());

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

const expenseRoutes = require('./routes/expense');
app.use('/expense', expenseRoutes);

const purchaseRoutes = require('./routes/purchase');
app.use('/purchase', purchaseRoutes);

const premiumRoutes = require('./routes/premium');
app.use('/premium', premiumRoutes);

const forgotPasswordRoutes = require('./routes/forgotpassword');
app.use('/password', forgotPasswordRoutes);

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`));
})

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgotpassword');
const FileDownloaded = require('./models/filedownloaded');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(FileDownloaded);
FileDownloaded.belongsTo(User);

sequelize.sync({})
    .then(() => {
        console.log('Listening...');
        app.listen(process.env.PORT || 5000);
    })
    .catch(err => console.log(err))