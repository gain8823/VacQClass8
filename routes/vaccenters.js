const express = require('express');

const { getVacCenters } = require('../controllers/vaccenters');

const router = express.Router();

router.route('/')
        .get(getVacCenters);

module.exports = router; 