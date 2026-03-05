const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  saveJobFromSearch,
  updateJob,
  deleteJob,
  getJobStats
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Job statistics - protected
router.get('/stats/summary', protect, getJobStats);

// Save job from search - protected
router.post('/save-from-search', protect, saveJobFromSearch);

// CRUD operations - protected
router.route('/')
  .get(protect, getJobs)
  .post(protect, createJob);

router.route('/:id')
  .get(protect, getJob)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;
