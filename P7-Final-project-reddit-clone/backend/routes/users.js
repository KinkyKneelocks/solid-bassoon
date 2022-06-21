const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users');

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3006');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/amiloggedin', userCtrl.amILoggedIn);
router.delete('/delete', userCtrl.deleteUser);
router.get('/logout', userCtrl.logout);

module.exports = router;