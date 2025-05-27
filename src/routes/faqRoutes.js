const express = require('express');
const router = express.Router();
const FaqController = require('../controllers/faqController');
const { verifyToken, isAdmin } = require('../middlewares/auth');


router.get('/', FaqController.getAll);


router.post('/', verifyToken, isAdmin, FaqController.create);


router.put('/:id', verifyToken, isAdmin, FaqController.update);


router.delete('/:id', verifyToken, isAdmin, FaqController.delete);

module.exports = router;
