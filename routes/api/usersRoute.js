const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/api/usersController');

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', req.headers["origin"]);
    // res.setHeader("P3P","CP=CAO PSA OUR");
    res.setHeader('Access-Control-Allow-Credentials','true');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Request-With,content-type, Origin, Accept');
    next();
  });

//GET_LIST
router.get('/', usersController.authToken, usersController.getList);

//CREATE
router.post('/', usersController.authToken, usersController.setCreate);

//UPDATE
router.put('/:id', usersController.authToken, usersController.setUpdate);

//GET_ONE
router.get('/:id', usersController.authToken, usersController.getShowOne);

//DELETE
router.delete('/:id', usersController.authToken, usersController.setDelete);

// DELETE_MANY
router.delete('/', usersController.authToken, usersController.delManyUser);

// LOGIN
router.post('/login', usersController.userLogin)

module.exports = router;