const express = require('express');

const userAuth = require('../middleware/auth');

const router = express.Router();

const leaderboardController = require('../controllers/leaderboard');

router.get('/leaderboard', userAuth.authenticate, leaderboardController.getUserLeaderboard);

module.exports = router;