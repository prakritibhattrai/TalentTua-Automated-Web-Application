import JobModel from '../models/jobModel.js';
import axios from 'axios';
import { findBestJobMatch, findBestTechs } from '../data/technology.js';
import { getOptimalData } from '../data/apiResponse.js';
import NodeCache from 'node-cache'
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 4000 });
let cachedData = {}

// FastAPI URL where you are hosting the match-job endpoint
const fastApiUrl = 'http://127.0.0.1:8000/match-job';
const JobController = {
    suggestJobAttributes: async (req, res) => {
        try {
            const { jobTitle } = req.body;
            const sanitizedJobTitle = jobTitle?.jobTitle?.trim() || jobTitle.selectedJobTitle?.title?.trim() || jobTitle?.occupation?.title?.trim();

            if (sanitizedJobTitle) {
                try {
                    // **Check Cache First**
                    const cachedData = cache.get(sanitizedJobTitle);
                    if (cachedData) {
                        console.log("Serving from cache:", sanitizedJobTitle);  // Log if cache hit
                        return res.status(200).json(cachedData); // Return cached data
                    } else {
                        console.log("Cache miss for:", sanitizedJobTitle);  // Log if cache miss
                    }

                    // If occupation title is provided, directly fetch the occupation
                    if (jobTitle?.occupation?.title) {
                        const occMatch = await JobController.fetchJobOccupation(sanitizedJobTitle);

                        if (occMatch && occMatch.length > 0) {
                            const onetsocCode = occMatch[0].code;

                            // Fetch occupation details using the onetsoc_code
                            const occupationData = await JobController.getAPIDetails(onetsocCode);
                            if (occupationData) {
                                // Extract bestTechnologies from the occupation data and merge with any additional tools from API
                                const additionalTechnologies = occupationData.keyProficiencies?.technicalSkills?.tools_and_technology || [];
                                const uniqueTechnologies = [...new Set(additionalTechnologies)];

                                occupationData.keyProficiencies = occupationData.keyProficiencies || {};
                                occupationData.keyProficiencies.technicalSkills = occupationData.keyProficiencies.technicalSkills || {};
                                occupationData.keyProficiencies.technicalSkills.tools_and_technology = uniqueTechnologies;

                                // Construct the final response data
                                const responseData = {
                                    jobTitle: sanitizedJobTitle,
                                    ...occupationData // Includes occupation details with technologies
                                };

                                // **Store in Cache for 30 minutes**
                                console.log("Storing in cache:", sanitizedJobTitle);  // Log when storing data in cache
                                cache.set(sanitizedJobTitle, responseData);

                                return res.status(200).json(responseData);
                            } else {
                                return res.status(404).json({ message: "Occupation details not found." });
                            }
                        } else {
                            return res.status(404).json({ message: "No occupation match found." });
                        }
                    } else {
                        const titleMatch = findBestJobMatch(sanitizedJobTitle);
                        let occMatch = null;
                        if (!titleMatch?.bestMatch) {
                            occMatch = await JobController.getJobTitleFromFastApi(sanitizedJobTitle);
                        }

                        if (titleMatch || occMatch) {
                            const onetsocCode = titleMatch?.onetsoc_code || occMatch?.onetsoc_code;

                            if (!onetsocCode) {
                                return res.status(400).json({ message: "No valid occupation code found." });
                            }

                            const occupationData = await JobController.getAPIDetails(onetsocCode);
                            if (occupationData) {
                                occupationData.keyProficiencies = occupationData.keyProficiencies || {};
                                occupationData.keyProficiencies.technicalSkills = occupationData.keyProficiencies.technicalSkills || {};
                                occupationData.keyProficiencies.technicalSkills.allTechnologies = titleMatch?.technologies || occMatch?.technologies;

                                const responseData = {
                                    jobTitle: sanitizedJobTitle,
                                    ...occupationData
                                };
                                // **Store in Cache for 30 minutes**
                                cache.set(sanitizedJobTitle, responseData);
                                console.log("Caching.....", cache.get(sanitizedJobTitle));
                                return res.status(200).json(responseData);
                            } else {
                                return res.status(404).json({ message: "Occupation details not found." });
                            }
                        } else {
                            return res.status(404).json({ message: "No job match found." });
                        }
                    }
                } catch (error) {
                    console.error("Error fetching job match or occupation details:", error);
                    return res.status(500).json({ message: "Internal server error." });
                }
            } else {
                return res.status(400).json({ message: "Job title or occupation title is required." });
            }
        } catch (error) {
            return res.status(500).json({
                error: 'An internal server error occurred'
            });
        }
    }
    ,
    saveJob: async (req, res) => {
        try {
            const {
                jobTitle,
                jobFamily,
                industry,
                seniorityLevel,
                stakeholderEngagement,
                traitMatrix,
                desirableSoftSkills,
                undesirableTraits,
                toolProficiencies,
                roleDescription
            } = req.body;

            // Convert job title to lowercase for consistent cache lookup
            const sanitizedJobTitle = (jobTitle?.jobTitle?.trim() || jobTitle.selectedJobTitle?.title?.trim() || jobTitle?.occupation?.title?.trim() || '');


            // **Check if job title exists in cache**

            const allTitles = [
                jobTitle?.jobTitle?.trim(),
                jobTitle?.occupation?.title?.trim(),
                jobTitle?.selectedJobTitle?.title?.trim()
            ].filter(Boolean).join(', ');

            const sanitizedData = {
                jobTitle: sanitizedJobTitle,
                allTitles,
                selectedJobTitle: jobTitle?.selectedJobTitle?.title?.trim() || null,
                occupation: jobTitle?.occupation?.title?.trim() || null,
                jobFamily: jobFamily?.trim() || null,
                industry: industry?.trim() || null,
                seniorityLevel: seniorityLevel?.trim() || null,
                stakeholderEngagement: stakeholderEngagement || {},
                traitMatrix: traitMatrix || {},
                desirableSoftSkills: desirableSoftSkills || [],
                undesirableTraits: undesirableTraits || [],
                toolProficiencies: toolProficiencies || [],
                roleDescription: roleDescription?.trim() || null,
            };
            const cachedData = cache.get(sanitizedJobTitle);
            console.log(cachedData)

            // // Make a POST request to the FastAPI server with the sanitized job title
            // const response = await axios.post('http://127.0.0.1:8000/process-onet-data',
            //     {
            //         "jobTitle": cachedData?.jobTitle,
            //         "title": cachedData?.title,
            //         "educationExpertise": {
            //             "knowledge": cachedData?.educationExpertise?.knowledge
            //         },
            //         "technicalSkills": {
            //             "technologies": cachedData?.keyProficiencies?.technicalSkills?.technologies,
            //             "tools": cachedData?.keyProficiencies?.technicalSkills?.tools,

            //         }
            //     });
            // console.log("Response", response)

            if (cachedData) {
                return res.status(200).json({
                    message: "Fetched from cache",
                    onet: cachedData,
                    recruiter: sanitizedData
                });
            } else {
                console.log("Cache miss for:", sanitizedJobTitle);
            }

            // Simulate a database insertion result
            const results = { insertId: 1 }; // Placeholder for inserted job ID

            // Store the new job data in cache for faster access next time
            cache.set(sanitizedJobTitle, sanitizedData);
            console.log("Storing in cache:", sanitizedJobTitle, sanitizedData);

            return res.status(200).json({
                message: 'Job saved successfully',
                jobId: results?.insertId || 'N/A',
                jobData: sanitizedData
            });

        } catch (error) {
            console.error("Error saving job:", error);
            return res.status(500).json({
                error: 'An error occurred while saving the job',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },
    // Function to fetch the job title match from FastAPI when no match is found in your local logic
    getJobTitleFromFastApi: async (sanitizedJobTitle) => {
        try {
            // Make a POST request to the FastAPI server with the sanitized job title
            const response = await axios.post(fastApiUrl, {
                user_input: sanitizedJobTitle
            });

            // Log and return the response data from FastAPI
            console.log('Job Title Match from FastAPI:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching job title match from FastAPI:', error.message);
            throw error;
        }
    },

    getAPIDetails: async (onetsoc_code) => {
        try {
            const url = `https://services.onetcenter.org/ws/online/occupations/${onetsoc_code}/details`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Basic ${process.env.ONET_API_KEY}`,
                },
                timeout: 5000
            });
            return getOptimalData(response.data)

        } catch (error) {
            console.error(`Failed to fetch occupations for job title: ${error.message}`);
            throw new Error(`API Request Failed: ${error.response?.status} - ${error.response?.statusText}`);
        }

    },
    getJobsByUserId: async (req, res) => {
        try {
            const { user_id } = req.params;

            if (!user_id || isNaN(parseInt(user_id))) {
                return res.status(400).json({ error: 'Valid user ID is required' });
            }

            const jobs = await JobModel.getJobsByUserIdAsync(parseInt(user_id));
            return res.status(200).json(jobs);

        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch jobs' });
        }
    },




    fetchJobOccupation: async (title) => {
        try {
            const encodedTitle = encodeURIComponent(title);
            const url = `${process.env.ONET_API_URL}/search?keyword=${encodedTitle}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Basic ${process.env.ONET_API_KEY}`,
                },
                timeout: 5000
            });

            if (response.data?.occupation?.length > 0) {
                return response.data.occupation;
            }
            throw new Error(`No occupations found for job title: ${title}`);
        } catch (error) {
            throw new Error(`Failed to fetch occupations for job title: ${title}. ${error.message}`);
        }
    },

    fetchJobOccupationSummary: async (id, type) => {
        try {
            const endpointMap = {
                summary: `${process.env.ONET_API_URL}/occupations/${encodeURIComponent(id)}/details?display=long`,
                tools_tech: `${process.env.ONET_API_URL}/occupations/${encodeURIComponent(id)}/details/technology_skills`
            };

            if (!endpointMap[type]) {
                throw new Error('Invalid summary type requested');
            }

            const response = await axios.get(endpointMap[type], {
                headers: {
                    Authorization: `Basic ${process.env.ONET_API_KEY}`,
                },
                timeout: 5000
            });

            return response.data || null;
        } catch (error) {
            res.status(500).json({ error: 'An internal error occurred.', details: apiError });
        }
    },

    processOccupationData: async (occupations) => {
        // Initialize empty result object
        const mergedData = {
            description: "No description available",
            essentialTraits: {},
            niceToHave: {
                skills: [],
                abilities: [],
                interests: [],
                work_activities: [],
                work_styles: []
            },
            unwantedTraits: {},
            keyProficiencies: {
                domainExpertise: {},
                technicalSkills: {
                    tools_and_technology: []
                }
            },
            educationExpertise: {
                education: [],
                knowledge: [],
                domain: []
            }
        };

        // Iterate through occupations and merge available data
        for (const occupation of occupations) {
            const [occupationSummary] = await Promise.all([
                JobController.fetchJobOccupationSummary(occupation.code, 'summary'),
            ]);
            // Update description if not already set and available in current occupation
            if (mergedData.description === "No description available" && occupationSummary?.occupation?.description) {
                mergedData.description = occupationSummary.occupation.description;
            }

            // Merge available data from current occupation
            if (occupationSummary?.skills?.element) {
                mergedData.niceToHave.skills = mergedData.niceToHave.skills.concat(
                    occupationSummary.skills.element.map(({ name }) => ({ name }))
                );
            }
            if (occupationSummary?.skills?.element) {
                mergedData.niceToHave.skills = mergedData.niceToHave.skills.concat(
                    occupationSummary.skills.element.map(({ name }) => ({ name }))
                );
            }
            if (occupationSummary?.technology_skills?.category) {
                // Define specific ids to prioritize
                //const priorityIds = ['43232402', '43232408', '43232304', '43232701', '43232400', '43232405', '43232705', '43232306']; // Replace with actual ids to prioritize

                // // Sort the category array based on the title id, prioritizing specific ids
                // const sortedCategory = occupationSummary.technology_skills.category.sort((a, b) => {
                //     const aPriority = priorityIds.includes(a.title.id.toString()) ? -1 : 1;
                //     const bPriority = priorityIds.includes(b.title.id.toString()) ? -1 : 1;
                //     return aPriority - bPriority || a.title.id - b.title.id;
                // });

                // Extract only the hot_technology from the example array and avoid duplicates
                occupationSummary?.technology_skills?.category.forEach(({ example }) => {
                    example.forEach(({ hot_technology }) => {
                        if (
                            hot_technology && // Ensure it is a hot technology
                            !mergedData.keyProficiencies.technicalSkills.tools_and_technology.includes(hot_technology) // Avoid duplicates
                        ) {
                            mergedData.keyProficiencies.technicalSkills.tools_and_technology.push(hot_technology);
                        }
                    });
                });
            }



            if (occupationSummary?.abilities?.element) {
                mergedData.niceToHave.abilities = mergedData.niceToHave.abilities.concat(
                    occupationSummary.abilities.element.map(({ name, description }) => ({ name, description }))
                );
            }

            if (occupationSummary?.interests?.element) {
                mergedData.niceToHave.interests = mergedData.niceToHave.interests.concat(
                    occupationSummary.interests.element.map(({ name, description }) => ({ name, description }))
                );
            }

            if (occupationSummary?.work_activities?.element) {
                mergedData.niceToHave.work_activities = mergedData.niceToHave.work_activities.concat(
                    occupationSummary.work_activities.element.map(({ name, description }) => ({ name, description }))
                );
            }

            if (occupationSummary?.work_styles?.element) {
                mergedData.niceToHave.work_styles = mergedData.niceToHave.work_styles.concat(
                    occupationSummary.work_styles.element.map(({ name, description }) => ({ name, description }))
                );
            }

            if (occupationSummary?.education?.level_required?.category) {
                mergedData.educationExpertise.education = mergedData.educationExpertise.education.concat(
                    occupationSummary.education.level_required.category.map(({ name, description }) => ({
                        name,
                        description: description || "No description available"
                    }))
                );
            }
            if (occupationSummary?.knowledge?.element) {
                mergedData.educationExpertise.knowledge = mergedData.educationExpertise.knowledge.concat(
                    occupationSummary.knowledge.element.map(({ name, description }) => ({
                        name,
                        description: description || "No description available"
                    }))
                );
            }



        }

        // Remove duplicates from arrays based on name property
        mergedData.niceToHave.skills = [...new Map(mergedData.niceToHave.skills.map(item => [item.name, item])).values()];
        mergedData.niceToHave.abilities = [...new Map(mergedData.niceToHave.abilities.map(item => [item.name, item])).values()];
        mergedData.niceToHave.interests = [...new Map(mergedData.niceToHave.interests.map(item => [item.name, item])).values()];
        mergedData.niceToHave.work_activities = [...new Map(mergedData.niceToHave.work_activities.map(item => [item.name, item])).values()];
        mergedData.niceToHave.work_styles = [...new Map(mergedData.niceToHave.work_styles.map(item => [item.name, item])).values()];
        mergedData.educationExpertise.education = [...new Map(mergedData.educationExpertise.education.map(item => [item.name, item])).values()];
        mergedData.educationExpertise.knowledge = [...new Map(mergedData.educationExpertise.knowledge.map(item => [item.name, item])).values()];
        mergedData.educationExpertise.domain = [...new Map(mergedData.educationExpertise.domain.map(item => [item.name, item])).values()];
        mergedData.keyProficiencies.technicalSkills.tools_and_technology = [...new Map(mergedData.keyProficiencies.technicalSkills.tools_and_technology.map(item => [item, item])).values()];
        // Return null if no data was collected
        const hasData = Object.values(mergedData.niceToHave).some(arr => arr.length > 0) ||
            mergedData.keyProficiencies.technicalSkills.tools_and_technology.length > 0;

        return hasData ? mergedData : null;
    }

};

export default JobController;
