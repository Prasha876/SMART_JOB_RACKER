const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Please provide job role/position'],
    trim: true,
    maxlength: [100, 'Role cannot be more than 100 characters']
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Rejected', 'Selected'],
    default: 'Applied',
    required: true
  },
  appliedDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  }
}, {
  timestamps: true
});

// Index for faster queries
jobSchema.index({ user: 1, status: 1 });
jobSchema.index({ user: 1, appliedDate: -1 });

module.exports = mongoose.model('Job', jobSchema);
