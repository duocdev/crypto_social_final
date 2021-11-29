const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');

router.post('/register', accountsController.register)
router.post('/login', accountsController.login)
router.post('/profile', accountsController.profile)
router.post('/follow', accountsController.follow)
router.post('/unfollow', accountsController.unfollow)
router.post('/update-info', accountsController.updateInfo)
router.post('/update-password', accountsController.updatePassword)




module.exports = router;