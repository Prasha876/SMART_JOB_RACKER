const SavedJob = require('../models/SavedJob');

// @desc    Save a job for the user
// @route   POST /api/saved-jobs
// @access  Private
const saveJob = async (req, res) => {
  try {
    const { job_id, job_title, employer_name, job_city, job_country, job_apply_link } = req.body;

    // Check if job is already saved by this user
    const existingJob = await SavedJob.findOne({
      user: req.user._id,
      job_id
    });

    if (existingJob) {
      return res.status(400).json({
        status: 'error',
        message: 'Job already saved'
      });
    }

    const savedJob = await SavedJob.create({
      user: req.user._id,
      job_id,
      job_title,
      employer_name,
      job_city,
      job_country,
      job_apply_link,
      status: 'Saved'
    });

    res.status(201).json({
      status: 'success',
      data: savedJob
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Job already saved'
      });
    }
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all saved jobs for the user
// @route   GET /api/saved-jobs
// @access  Private
const getUserJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: savedJobs.length,
      data: savedJobs
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update job status
// @route   PUT /api/saved-jobs/:id
// @access  Private
const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status value'
      });
    }

    const savedJob = await SavedJob.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!savedJob) {
      return res.status(404).json({
        status: 'error',
        message: 'Saved job not found'
      });
    }

    savedJob.status = status;
    await savedJob.save();

    res.status(200).json({
      status: 'success',
      data: savedJob
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  saveJob,
  getUserJobs,
  updateJobStatus
};
