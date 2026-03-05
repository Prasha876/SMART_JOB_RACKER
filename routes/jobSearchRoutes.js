const express = require('express');
const router = express.Router();
const { searchJobs } = require('../controllers/jobSearchController');

// GET /search - Search jobs using JSearch API
router.get('/search', searchJobs);

module.exports = router;
