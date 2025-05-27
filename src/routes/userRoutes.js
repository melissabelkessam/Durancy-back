const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // version orientée objet
const { verifyToken, isAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');


router.post('/register', upload.single('profile_pic'), userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);



router.get('/me', verifyToken, userController.getMe);
router.put('/me', verifyToken, upload.single('profile_pic'), userController.updateMe);
router.delete('/me', verifyToken, userController.deleteMe);


router.get('/', verifyToken, isAdmin, userController.getAll);
router.put('/:id', verifyToken, userController.update);     
router.delete('/:id', verifyToken, userController.delete);  

module.exports = router;
