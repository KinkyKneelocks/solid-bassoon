const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/users');

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

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
router.delete('/delete', auth, userCtrl.deleteUser);
router.get('/logout', userCtrl.logout);
router.post('/user', auth, userCtrl.getUserData);
router.put('/changepassword', auth, userCtrl.changePassword);
router.put('/changeusername', auth, userCtrl.changeUsername);
router.put('/changeprofilepic', auth, multer, userCtrl.changeProfilepic);

module.exports = router;