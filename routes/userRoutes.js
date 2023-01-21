const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');



router.get('/', userController.getAll);
router.post('/postUser', userController.postUserData);


module.exports = router;
