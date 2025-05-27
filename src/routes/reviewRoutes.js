// src/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const { verifyToken, isAdmin } = require('../middlewares/auth');


router.get('/tutorial/:tutorial_id', ReviewController.getByTutorial);


router.post('/', verifyToken, ReviewController.create);


router.get('/', verifyToken, isAdmin, ReviewController.getAll);

router.delete('/:id', verifyToken, isAdmin, ReviewController.delete);


router.get('/top/best', ReviewController.getBest);

module.exports = router;
