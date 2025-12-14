const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const {requireAdmin} = require('../middleware/admin.middleware');
const {
  createSweet,
  getAllSweets,
  purchaseSweet,
  restockSweet,
  searchSweets,
  updateSweet,
  deleteSweet
} = require('../controllers/sweets.controller');

const router = express.Router();


router.post('/', requireAuth, requireAdmin, createSweet);
router.get('/', requireAuth, getAllSweets);
router.post('/:id/purchase', requireAuth, purchaseSweet);
router.post('/:id/restock', requireAuth, requireAdmin, restockSweet);
router.get('/search', requireAuth,searchSweets);
router.put('/:id', requireAuth, requireAdmin, updateSweet);
router.delete('/:id', requireAuth, requireAdmin, deleteSweet);


module.exports = router;
