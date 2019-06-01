const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/api/usersController');
const rolesController = require('../../controllers/api/rolesController');

router.use(function (req, res, next) {
    
    res.setHeader('Access-Control-Allow-Origin', req.headers["referer"]);
    res.setHeader('Access-Control-Allow-Credentials','true');
    // res.setHeader("P3P","CP=CAO PSA OUR");
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Request-With,content-type, Origin, Accept');
    next();
  });



//GET_TOKEN
router.get('/gettoken', usersController.getToken);

// CHECK_USER
router.get('/checkuser', usersController.checkuser);

// USER_LOGOUT
router.get('/logout', usersController.logout);

// 獲取所有的roles
router.get('/getallroles', rolesController.getAllRole);

// 獲取當前user的權限
router.get('/getuseractions', usersController.getUserActions);

module.exports = router;