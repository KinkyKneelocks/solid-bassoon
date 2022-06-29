const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/posts');
const auth = require('../middleware/auth')

const multer = require('../middleware/multer-config');

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3006');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, multer, postCtrl.addPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.put('/:id', auth, multer, postCtrl.updatePost);

router.get('/comments/:id', auth, postCtrl.getCommentsForPost);
router.post('/comments', auth, postCtrl.addComment);
router.delete('/comments/:id', auth, postCtrl.deleteComment);

module.exports = router;