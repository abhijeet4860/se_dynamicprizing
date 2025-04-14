const express = require('express');
const router = express.Router();
const { 
    addProduct, 
    getProducts, 
    getProductInfo, 
    getUserProduct, 
    deleteProduct, 
    updateProduct
    // getUserName  // Make sure this function exists in your controller
} = require('../controllers/productController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Product routes
router.post('/add-product', upload.array('photos'), addProduct);
router.get('/get-products', getProducts);
router.get('/get-product/:productId', getProductInfo);
router.get('/get-userproduct', getUserProduct);
router.delete('/delete-product/:productId', deleteProduct);
router.put('/update-product/:productId', updateProduct);
// router.get('/get-username/:userId', getUserName);  // This is line 14 that's causing the error

module.exports = router;