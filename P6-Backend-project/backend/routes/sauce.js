const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceControl = require('../controllers/sauce');

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

router.get('/', auth, sauceControl.getAllSauces);
router.get('/:id', auth,  sauceControl.getOneSauce);
router.post('/', auth, multer, sauceControl.addSauce);
router.delete('/:id', auth, sauceControl.deleteSauce);
router.put('/:id', auth, multer, sauceControl.modifySauce);
router.post('/:id/like', auth, sauceControl.rateSauce);


module.exports = router;