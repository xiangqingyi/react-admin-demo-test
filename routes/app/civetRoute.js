const express = require('express');
const router = express.Router();
const checkCivetUser = require('../../middlewares/CheckCivetUser');
const civetController = require('../../controllers/app/civetController');

router.get('/cleancache', civetController.cleanCache);

router.get('/indexgetinfo', checkCivetUser, civetController.authenticateMember, civetController.indexGetInfo);

router.get('/formgetinfo', checkCivetUser, civetController.authenticateMember, civetController.formGetInfo);

router.get('/getuserindex', civetController.getUserIndex);
module.exports = router;