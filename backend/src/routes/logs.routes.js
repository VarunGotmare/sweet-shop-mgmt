const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');
const { getLogs } = require('../controllers/logs.controller');

router.get('/', requireAuth, requireAdmin, getLogs);

module.exports = router;
