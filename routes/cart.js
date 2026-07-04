const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Cart is stored client-side (localStorage), this route validates products
router.post('/validate', protect, async (req, res) => {
  try {
    const { items } = req.body;
    const validated = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product && product.stock >= item.quantity) {
        validated.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image,
          stock: product.stock
        });
      }
    }

    res.json(validated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
