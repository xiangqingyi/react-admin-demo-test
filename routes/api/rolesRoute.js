const express = require('express');
const router = express.Router();
const rolesController = require('../../controllers/api/rolesController');
const usersController = require('../../controllers/api/usersController');
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', req.headers["origin"]);
    // res.setHeader("P3P","CP=CAO PSA OUR");
    res.setHeader('Access-Control-Allow-Credentials','true');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Request-With,content-type, Origin, Accept');
    next(); 
})

// GET_LIST_ROLE
router.get('/', usersController.authToken, rolesController.getListRole);

// CREATE_ROLE
router.post('/', usersController.authToken, rolesController.setCreateRole);

// UPDATE_ROLE
router.put('/:id', usersController.authToken, rolesController.setUpdateRole);

// GET_ONE_ROLE
router.get('/:id', usersController.authToken, rolesController.getShowOneRole);

// DELETE_ROLE
router.delete('/:id', usersController.authToken, rolesController.setDeleteRole);

// DELETE_MANY
router.delete('/', usersController.authToken, rolesController.delManyRole);

module.exports = router;