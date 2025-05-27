const express = require('express');
const router = express.Router();
const tutorialController = require('../controllers/tutorialController');


router.post('/', tutorialController.create);


router.get('/', tutorialController.getAll);


router.get('/kit/:kitId', tutorialController.getByKitId);


router.put('/:id', tutorialController.update);


router.delete('/:id', tutorialController.delete);

module.exports = router;
