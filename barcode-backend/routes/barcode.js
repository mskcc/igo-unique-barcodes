var express = require('express');
const PlateBarcodesController = require('../controllers/PlateBarcodesController');
var router = express.Router();

router.get('/plateBarcode', PlateBarcodesController.generateUniqueBarcode);
router.post('/writeToFile', PlateBarcodesController.writeToFile);
router.get('/picklist', PlateBarcodesController.picklist);

module.exports = router;