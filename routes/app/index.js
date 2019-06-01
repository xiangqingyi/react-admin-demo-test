const express = require('express');
const path = require('path');
const router = express.Router();
const civetRoute = require('./civetRoute');

router.use('/civet', civetRoute);

// Handles any requests that don't match the ones above
router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build', 'app.html'));
});

module.exports = router;