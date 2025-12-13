const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const {requireAdmin} = require('../middleware/admin.middleware');
const {
  createSweet,
  getAllSweets,
} = require('../controllers/sweets.controller');

const router = express.Router();


router.post('/', requireAuth, requireAdmin, createSweet);


router.get('/', requireAuth, getAllSweets);

module.exports = router;
