import JobModel from '../models/jobModel.js';
import axios from 'axios';

const JobController = {
    createJob: async (req, res) => {
        const { jobTitle } = req.body;
        console.log(jobTitle)
        if (!jobTitle) {
            return res.status(400).send({ error: 'Job title is required' });
        }

        try {
            // Fetch occupation details by job title
            const jobTitleOccupation = await JobController.fetchJobOccupation(jobTitle);
            console.log(jobTitleOccupation)
            if (!jobTitleOccupation || !jobTitleOccupation.code) {
                return res.status(404).send({ error: 'Occupation not found for the provided job title' });
            }

            const occupationSummary = await JobController.fetchJobOccupationSummary(jobTitleOccupation.code, 'summary');
            const toolsAndTechnology = await JobController.fetchJobOccupationSummary(jobTitleOccupation.code, 'tools_tech');
            console.log(toolsAndTechnology.category[0])
            console.log(toolsAndTechnology.category[1])
            console.log(toolsAndTechnology.category[2])
            console.log(toolsAndTechnology.category[3])
            if (!occupationSummary || !toolsAndTechnology) {
                return res.status(500).send({ error: 'Failed to fetch occupation data' });
            }

            // Prepare response
            const responseData = {
                title: jobTitle,
                summary: occupationSummary,
                tools_and_technology: toolsAndTechnology.category || [],
            };

            return res.status(200).send(responseData);
        } catch (error) {
            console.error('Error fetching O*NET data:', error);
            return res.status(500).send({ error: 'An internal error occurred' });
        }
    },

    getJobsByUserId: (req, res) => {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        JobModel.getJobsByUserId(user_id, (err, results) => {
            if (err) {
                console.error('Error fetching jobs:', err);
                return res.status(500).send({ error: 'Failed to fetch jobs' });
            }
            res.send(results);
        });
    },

    fetchJobOccupation: async (title) => {
        try {
            const response = await axios.get(`https://services.onetcenter.org/ws/online/search?keyword=${title}`, {
                headers: {
                    Authorization: 'Basic dGFsZW50dHVhOjY4NTdzaHI=',
                },
            });

            // Ensure the response contains occupation data
            if (response.data && response.data.occupation && response.data.occupation.length > 0) {
                return response.data.occupation[0];
            }

            return null; // Return null if no occupation is found
        } catch (error) {
            console.error('Error fetching job occupation:', error.message);
            return null;
        }
    },

    fetchJobOccupationSummary: async (id, type) => {
        try {
            const endpointMap = {
                summary: `https://services.onetcenter.org/ws/online/occupations/${id}/details`,
                tools_tech: `https://services.onetcenter.org/ws/online/occupations/${id}/summary/technology_skills`,
            };

            const response = await axios.get(endpointMap[type], {
                headers: {
                    Authorization: 'Basic dGFsZW50dHVhOjY4NTdzaHI=',

                },
            });

            return response.data || null;
        } catch (error) {
            console.error(`Error fetching job occupation ${type}:`, error.message);
            return null;
        }
    },

};

export default JobController;
