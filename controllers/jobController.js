const Job = require('../models/Job');

// @desc    Get all jobs for logged in user
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { user: req.user.id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by company name (case-insensitive)
    if (search) {
      query.companyName = { $regex: search, $options: 'i' };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Job.countDocuments(query);

    // Get jobs with pagination
    const jobs = await Job.find(query)
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      status: 'success',
      count: jobs.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: {
        jobs
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Make sure user owns the job
    if (job.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this job'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        job
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        job
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Save job from job search
// @route   POST /api/jobs/save-from-search
// @access  Private
const saveJobFromSearch = async (req, res) => {
  try {
    const { job_id, job_title, employer_name, job_city, job_country, job_apply_link } = req.body;

    // Check if job is already saved by this user
    const existingJob = await Job.findOne({
      user: req.user.id,
      job_id
    });

    if (existingJob) {
      return res.status(400).json({
        status: 'error',
        message: 'Job already saved'
      });
    }

    // Build location string
    const location = [job_city, job_country].filter(Boolean).join(', ');

    // Create job entry
    const job = await Job.create({
      user: req.user.id,
      companyName: employer_name,
      role: job_title,
      status: 'Saved',
      location: location,
      jobLink: job_apply_link,
      appliedDate: new Date()
    });

    res.status(201).json({
      status: 'success',
      data: {
        job
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Job already saved'
      });
    }
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Make sure user owns the job
    if (job.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this job'
      });
    }

    // Check if status is being changed
    if (req.body.status && req.body.status !== job.status) {
      // Push old status into statusHistory using $push
      await Job.findByIdAndUpdate(req.params.id, {
        $push: {
          statusHistory: {
            status: job.status,
            changedAt: new Date()
          }
        }
      });
    }

    // Update job with new data (notes, interviewDate, status, etc.)
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        job
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Make sure user owns the job
    if (job.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      status: 'success',
      data: {},
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats/summary
// @access  Private
const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Job.countDocuments({ user: req.user.id });

    res.status(200).json({
      status: 'success',
      data: {
        total,
        stats
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  saveJobFromSearch,
  updateJob,
  deleteJob,
  getJobStats
};
