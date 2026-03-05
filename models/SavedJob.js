const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  job_id: {
    type: String,
    required: [true, 'Job ID is required']
  },
  job_title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  employer_name: {
    type: String,
    trim: true
  },
  job_city: {
    type: String,
    trim: true
  },
  job_country: {
    type: String,
    trim: true
  },
  job_apply_link: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'],
    default: 'Saved'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate job saves for the same user
savedJobSchema.index({ user: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', savedJobSchema);
