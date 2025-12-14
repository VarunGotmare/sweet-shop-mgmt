const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const {requireAdmin} = require('../middleware/admin.middleware');
const {
  createSweet,
  getAllSweets,
  purchaseSweet,
  restockSweet,
} = require('../controllers/sweets.controller');

const router = express.Router();


router.post('/', requireAuth, requireAdmin, createSweet);
router.get('/', requireAuth, getAllSweets);
router.post('/:id/purchase', requireAuth, purchaseSweet);
router.post('/:id/restock', requireAuth, requireAdmin, restockSweet);

module.exports = router;
