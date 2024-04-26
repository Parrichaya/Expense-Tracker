const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const FileDownloaded = sequelize.define('filedownloaded', {
    id:{
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
    fileURL: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = FileDownloaded