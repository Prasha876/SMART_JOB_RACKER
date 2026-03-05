const express = require('express');
const { saveJob, getUserJobs, updateJobStatus } = require('../controllers/savedJobController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// POST /api/saved-jobs - Save a job
router.post('/', saveJob);

// GET /api/saved-jobs - Get all saved jobs for the user
router.get('/', getUserJobs);

// PUT /api/saved-jobs/:id - Update job status
router.put('/:id', updateJobStatus);

module.exports = router;
