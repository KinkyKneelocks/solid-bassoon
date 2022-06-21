const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/posts');

const multer = require('../middleware/multer-config');

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3006');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

router.get('/', postCtrl.getAllPosts);
router.get('/:id', postCtrl.getOnePost);
router.post('/', multer, postCtrl.addPost);
router.delete('/:id', postCtrl.deletePost);
router.put('/:id', postCtrl.updatePost);

router.get('/comments/:id', postCtrl.getCommentsForPost);
router.post('/comments', postCtrl.addComment);
router.delete('/comments/:id', postCtrl.deleteComment);

module.exports = router;