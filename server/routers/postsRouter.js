const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

router.post('/create', postsController.create)
router.post('/list', postsController.list)
router.post('/like', postsController.like)
router.post('/unlike', postsController.unlike)
router.post('/post', postsController.post)
router.post('/comment', postsController.comment)

module.exports = router;