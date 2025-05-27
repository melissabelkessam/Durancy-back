const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/auth');


router.post('/', verifyToken, orderController.create);

router.delete('/:id', verifyToken, isAdmin, orderController.delete);


router.patch('/:id/cancel', verifyToken, isAdmin, orderController.cancel);

router.get('/', verifyToken, isAdmin, orderController.getAll);

router.get('/me', verifyToken, orderController.getMyOrders);

router.get('/:id', verifyToken, orderController.getByIdSecure); 

router.patch('/:id/status', verifyToken, isAdmin, orderController.updateStatus);
 
router.patch('/:id/confirm-delivery', verifyToken, orderController.markAsDelivered);






module.exports = router;
