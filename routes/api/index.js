const express = require('express');
const router = express.Router();
const usersRoute = require('./usersRoute');
const tokenRoute = require('./tokenRoute');
const roleRoute = require('./rolesRoute')

router.use('/users', usersRoute);
router.use('/', tokenRoute);
router.use('/roles', roleRoute);

module.exports = router;