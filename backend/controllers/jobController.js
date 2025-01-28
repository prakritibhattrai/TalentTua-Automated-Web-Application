import JobModel from '../models/jobModel.js';
import axios from 'axios';
import db from '../config/db.js';


const JobController = {
    suggestJobAttributes: async (req, res) => {
        try {
            const { jobTitle } = req.body;
            const sanitizedJobTitle = jobTitle?.jobTitle?.trim() || jobTitle.selectedJobTitle?.trim() || jobTitle?.occupation?.title?.trim();
            const occupations = await JobController.fetchJobOccupation(sanitizedJobTitle);
            if (!occupations?.length) {
                return res.status(404).json({
                    error: 'No occupations found for the provided job title'
                });
            }

            const occupationData = await JobController.processOccupationData(occupations);
            if (!occupationData) {
                return res.status(404).json({
                    error: 'No occupations with complete data found',
                    occupation_code: occupations[0]?.code || 'N/A'
                });
            }
            const responseData = {
                jobTitle: sanitizedJobTitle,
                ...occupationData
            };
            return res.status(200).json(responseData);

        } catch (error) {
            console.error('Error processing job data:', error);
            return res.status(500).json({
                error: 'An internal server error occurred'
            });
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
            console.error('Error fetching jobs:', error);
            return res.status(500).json({ error: 'Failed to fetch jobs' });
        }
    },

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
            const sanitizedData = {
                jobTitle: jobTitle?.jobTitle?.trim() || jobTitle?.occupation?.title?.trim() || jobTitle?.selectedJobTitle?.trim(),
                selectedJobTitle: jobTitle?.selectedJobTitle?.trim() || null,
                occupation: jobTitle?.occupation?.title?.trim() || null,
                jobFamily: jobFamily?.trim() || null,
                industry: industry?.trim() || null,
                seniorityLevel: seniorityLevel?.trim() || null,
                stakeholderEngagement: JSON.stringify(stakeholderEngagement || {}),
                traitMatrix: JSON.stringify(traitMatrix || {}),
                desirableSoftSkills: JSON.stringify(desirableSoftSkills || []),
                undesirableTraits: JSON.stringify(undesirableTraits || []),
                toolProficiencies: JSON.stringify(toolProficiencies || []),
                roleDescription: roleDescription?.trim() || null,
            };

            // Ensure all values are sanitized and match the column order
            const sanitizedValues = Object.values(sanitizedData).map((value) =>
                typeof value === 'object' && value !== null ? JSON.stringify(value) : value
            );

            const connection = db.promise();
            await connection.beginTransaction();

            try {
                // Insert sanitized values into the database
                const [results] = await connection.execute(
                    `INSERT INTO jobs (
            job_title, alternate_title, occupation, job_family, industry, seniority_level,
            stakeholder_engagement, trait_matrix, desirable_soft_skills, undesirable_traits, 
            tool_proficiencies, role_description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    sanitizedValues
                );
                console.log(results)
                //const [results] = ["Data inserted successfully"];
                const occupations = await JobController.fetchJobOccupation(sanitizedData.jobTitle);

                if (!occupations?.length) {
                    await connection.commit();
                    return res.status(404).json({
                        error: 'No occupations found for the provided job title',
                        jobId: results?.insertId?.toString() || 'N/A'
                    });
                }

                const occupationData = await JobController.processOccupationData(occupations);

                await connection.commit();

                if (!occupationData) {
                    return res.status(404).json({
                        error: 'No matching occupation data found',
                        jobId: results?.insertId?.toString() || 'N/A'
                    });
                }

                return res.status(200).json({
                    recruiter: {
                        ...sanitizedData,
                        stakeholderEngagement: JSON.parse(sanitizedData.stakeholderEngagement),
                        traitMatrix: JSON.parse(sanitizedData.traitMatrix),
                        desirableSoftSkills: JSON.parse(sanitizedData.desirableSoftSkills),
                        undesirableTraits: JSON.parse(sanitizedData.undesirableTraits),
                        toolProficiencies: JSON.parse(sanitizedData.toolProficiencies),
                    },
                    onet: occupationData,
                    message: 'Job saved successfully',
                    jobId: results?.insertId || 'N/A'
                });

            } catch (error) {
                await connection.rollback();
                throw error;
            }

        } catch (error) {
            console.error('Error in saveJob:', error);
            return res.status(500).json({
                error: 'An error occurred while saving the job',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
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
            console.error('Error fetching job occupation:', error.message);
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
            console.error(`Error fetching job occupation ${type}:`, error.message);
            return null;
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
                    occupationSummary.skills.element.map(({ name, description }) => ({ name, description }))
                );
            }
            if (occupationSummary?.skills?.element) {
                mergedData.niceToHave.skills = mergedData.niceToHave.skills.concat(
                    occupationSummary.skills.element.map(({ name, description }) => ({ name, description }))
                );
            }
            if (occupationSummary?.technology_skills?.category) {
                // Define specific ids to prioritize
                const priorityIds = ['43232402', '43232408', '43232304', '43232701', '43232400', '43232405', '43232705', '43232306']; // Replace with actual ids to prioritize

                // Sort the category array based on the title id, prioritizing specific ids
                const sortedCategory = occupationSummary.technology_skills.category.sort((a, b) => {
                    const aPriority = priorityIds.includes(a.title.id.toString()) ? -1 : 1;
                    const bPriority = priorityIds.includes(b.title.id.toString()) ? -1 : 1;
                    return aPriority - bPriority || a.title.id - b.title.id;
                });

                // Extract only the hot_technology from the example array and avoid duplicates
                sortedCategory.forEach(({ example }) => {
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
