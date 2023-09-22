const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const { upload, imageOptimization } = require("../middleware/multer-config");

const bookCtrl = require('../controllers/book');


router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, upload, imageOptimization, bookCtrl.createBook);
router.get('/bestrating', bookCtrl.bestRating)
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, upload, imageOptimization, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.addRating);


module.exports = router;