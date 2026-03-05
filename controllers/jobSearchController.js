const axios = require('axios');

/**
 * Search jobs using RapidAPI JSearch
 * @route GET /api/jobs/search
 * @access Public
 */
const searchJobs = async (req, res) => {
  try {
    const { query, location } = req.query;

    // Validate required parameters
    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Query parameter is required'
      });
    }

    // Make request to RapidAPI JSearch
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: `${query} in ${location}`,
        page: 1,
        num_pages: 1
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
      }
    });

    // Transform and simplify the data
    const simplifiedJobs = response.data.data.map(job => ({
      job_id: job.job_id,
      job_title: job.job_title,
      employer_name: job.employer_name,
      job_city: job.job_city,
      job_country: job.job_country,
      job_apply_link: job.job_apply_link
    }));

    res.status(200).json({
      status: 'success',
      data: simplifiedJobs
    });

  } catch (error) {
    console.error('Error searching jobs:', error.message);

    // Handle RapidAPI errors
    if (error.response) {
      return res.status(error.response.status || 500).json({
        status: 'error',
        message: error.response.data?.message || 'Error from RapidAPI'
      });
    }

    // Handle network errors
    if (error.request) {
      return res.status(503).json({
        status: 'error',
        message: 'Service unavailable - unable to reach job search API'
      });
    }

    // Handle other errors
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal Server Error'
    });
  }
};

module.exports = {
  searchJobs
};
