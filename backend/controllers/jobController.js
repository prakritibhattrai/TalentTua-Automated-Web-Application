import JobModel from '../models/jobModel.js';

const JobController = {
    createJob: (req, res) => {
        const jobData = req.body;
        // Validate input
        if (!jobData.title || !jobData.family || !jobData.industry ||
            !jobData.location || !jobData.user_id || !jobData.hoursOfWork
            || !jobData.employmentType || !jobData.seniorityLevel || !jobData.stakeholderEngagement || !jobData.description
            || !jobData.traitMatrix || !jobData.desirableSkills || !jobData.undesirableSkills || !jobData.salary
            || !jobData.toolsAndTechnologies) {
            return res.status(400).send('All fields are required');
        }

        JobModel.createJob(jobData, (err, result) => {
            if (err) {
                console.error('Error creating job:', err);
                return res.status(500).send('Failed to create job');
            }
            res.status(201).send({ id: result.insertId, ...jobData });
        });
    },

    getJobsByUserId: (req, res) => {
        const { user_id } = req.params;

        JobModel.getJobsByUserId(user_id, (err, results) => {
            if (err) {
                console.error('Error fetching jobs:', err);
                return res.status(500).send('Failed to fetch jobs');
            }
            res.send(results);
        });
    }


};

export default JobController;