import db from '../config/db.js';
import JobModel from '../models/jobModel.js';
import axios from 'axios';

let jobTitlesCache = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;
const jobTitlesByOccupationCache = {};
const OccupationController = {
    saveJobForICP: async (req, res) => {

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
                //user_id: parseInt(user_id),
                jobTitle: jobTitle.occupation.jobTitle.trim(),
                jobFamily: jobFamily?.trim() || null,
                industry: industry?.trim() || null,
                seniorityLevel: seniorityLevel?.trim() || null,
                stakeholderEngagement: JSON.stringify(stakeholderEngagement || {}),
                traitMatrix: JSON.stringify(traitMatrix || {}),
                desirableSoftSkills: JSON.stringify(desirableSoftSkills || []),
                undesirableTraits: JSON.stringify(undesirableTraits || []),
                toolProficiencies: JSON.stringify(toolProficiencies || []),
                roleDescription: roleDescription?.trim() || null
            };

            const connection = db.promise();
            await connection.beginTransaction();

            try {
                // const [results] = await connection.execute(
                //     `INSERT INTO jobs (
                //          job_title, job_family, industry, seniority_level,
                //         stakeholder_engagement, trait_matrix, desirable_soft_skills,
                //         undesirable_traits, tool_proficiencies, role_description
                //     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                //     Object.values(sanitizedData)
                // );
                const [results] = ["Data inserted successfully"];
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
            return res.status(500).json({
                error: 'An error occurred while saving the job',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },
    getOccupation: async (req, res) => {
        try {
            const currentTime = Date.now();
            // Check if the cache is valid (within the cache duration)
            if (jobTitlesCache.length > 0 && cacheTimestamp && (currentTime - cacheTimestamp < CACHE_DURATION)) {
                return res.json({
                    jobTitles: jobTitlesCache,
                    message: `Fetched ${jobTitlesCache.length} job titles from cache.`,
                    status: 200,
                    success: true,
                });
            }

            let jobTitles = [];

            // First, try fetching from the external API (e.g., O*NET API)
            try {
                const url = `${process.env.ONET_API_URL}/occupations?start=1&end=1100`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Basic ${process.env.ONET_API_KEY}`,
                    },
                    timeout: 5000,
                });

                if (response.data.occupation && response.data.occupation.length > 0) {
                    jobTitles = response.data.occupation.map((item) => ({
                        title: item.title,
                        id: item.code,
                    }));
                }
            } catch (apiError) {
                return res.status(500).json({
                    error: "Error Occured"
                })
            }

            // If no results from the external API, fallback to the database
            if (jobTitles.length === 0) {
                try {
                    const query = `SELECT DISTINCT title, onetsoc_code as id FROM occupation_data ORDER BY title ASC`;
                    const [results] = await db.promise().query(query);

                    if (results.length > 0) {
                        jobTitles = results.map((row) => ({ title: row.title, id: row.onetsoc_code }));
                    }
                } catch (dbError) {
                    return res.status(500).json({
                        error: "Error Occured"
                    })
                }
            }
            // If no job titles were found from both sources, send an error
            if (jobTitles.length === 0) {
                return res.status(500).json({
                    error: 'Failed to fetch job titles from both external API and database.',
                });
            }

            // Update cache and timestamp
            jobTitlesCache = jobTitles;
            cacheTimestamp = currentTime;

            return res.json({
                jobTitles,
                message: `Fetched ${jobTitles.length} job titles.`,
                status: 200,
                success: true,
            });
        } catch (error) {
            return res.status(500).json({ error: 'An internal error occurred.' });
        }
    },
    getjobTitleByOccupationId: async (req, res) => {
        const { occupation_id } = req.params;

        // Validate that occupation_id is provided
        if (!occupation_id) {
            return res.status(400).json({ error: 'Occupation ID is required.' });
        }

        // Check if the job titles for this occupation_id are already cached
        if (jobTitlesByOccupationCache[occupation_id]) {
            return res.json({
                jobTitles: jobTitlesByOccupationCache[occupation_id],
                message: `Fetched job titles for occupation ID ${occupation_id} from cache.`,
                status: 200,
                success: true,
            });
        }

        let jobTitles = [];

        // First, attempt to fetch from the external API
        try {
            const url = `${process.env.ONET_API_URL}/occupations/${occupation_id}/summary/related_occupations`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Basic ${process.env.ONET_API_KEY}`,
                },
                timeout: 5000,
            });


            if (response.data.occupation && response.data.occupation.length > 0) {
                jobTitles = response.data.occupation.map((item) => ({
                    title: item.title,
                }));
            }
        } catch (apiError) {
            return res.status(500).json({ error: 'An internal error occurred.', details: apiError });


        }

        // If no results from the API, fallback to the database
        if (jobTitles.length === 0) {
            const query = `
        SELECT DISTINCT reported_job_title AS title 
        FROM sample_of_reported_titles 
        WHERE onetsoc_code = ?
        UNION
        SELECT DISTINCT alternate_title AS title 
        FROM alternate_titles 
        WHERE onetsoc_code = ?
    `;

            try {
                const [results] = await db.promise().query(query, [occupation_id, occupation_id]);

                if (results.length > 0) {
                    jobTitles = results.map((row) => ({ title: row.title }));
                }
            } catch (dbError) {

                // Return error only if both API and database fail
                return res.status(500).json({ error: 'Failed to fetch job titles from both database and external API.' });
            }
        }

        // If no results were found from both sources, return an error
        if (jobTitles.length === 0) {
            return res.status(404).json({ error: 'No job titles found for the provided occupation ID.' });
        }

        // Cache the job titles for this occupation_id
        jobTitlesByOccupationCache[occupation_id] = jobTitles;

        // Return the results with a success message
        res.json({
            jobTitles,
            message: `Fetched ${jobTitles.length} unique job titles for occupation ID ${occupation_id}.`,
            status: 200,
            success: true,
        });
    },
    // Suggest job attributes based on the provided job title
    suggestJobAttributes: async (req, res) => {
        const { occupation, jobTitle } = req.body;

        try {
            // Step 2: Fetch Occupation Details from Database
            const occupationId = occupation.id; // Hardcoded for testing

            const technology_skills = await OccupationController.getTechnologySkills(occupationId);
            const sortedTechnologySkills = technology_skills.map(item => item.example);  // Extract only the element_name;
            const knowledge = await OccupationController.getKnowledge(occupationId);

            const work_styles = await OccupationController.getWorkStyles(occupationId);
            const work_activities = await OccupationController.getWorkActivities(occupationId);
            const work_values = await OccupationController.getWorkValues(occupationId);
            const skills = await OccupationController.getSkills(occupationId);
            const abilities = await OccupationController.getAbilities(occupationId);
            // Apply the common function to each of the items
            const sortedWorkStyles = OccupationController.getTopElements(work_styles);
            const sortedWorkActivities = OccupationController.getTopElements(work_activities);
            const sortedWorkValues = OccupationController.getTopElements(work_values);
            const sortedSkills = OccupationController.getTopElements(skills);
            const sortedAbilities = OccupationController.getTopElements(abilities);

            res.json({
                onet: {
                    work_styles: sortedWorkStyles,
                    work_activities: sortedWorkActivities,
                    work_values: sortedWorkValues,
                    skills: sortedSkills,
                    abilities: sortedAbilities,
                    technology_skills: sortedTechnologySkills,
                    knowledge: knowledge,
                }
            });

        } catch (error) {
            res.status(500).json({ error: 'An internal error occurred.', details: error });
        }
    },
    // Common function to sort and get the element_name from the top items based on data_value
    getTopElements: (items, scaleId = 'IM', topN = 20) => {
        return items
            .filter(item => item.scale_id === scaleId)  // Filter by scale_id
            .sort((a, b) => parseFloat(b.data_value) - parseFloat(a.data_value))  // Sort by data_value descending
            .slice(0, topN)  // Take top N items
            .map(item => item.element_name);  // Extract only the element_name
    },

    fetchOccupByTitle: async (job_title) => {
        try {
            // Normalize input job title
            const normalizedJobTitle = job_title.toLowerCase().trim();

            // Query using direct title comparison and LIKE operator
            const query = `
            SELECT 
                o.onetsoc_code,
                o.title
            FROM occupation_data o 
            WHERE LOWER(o.title) LIKE ?
               OR LOWER(o.title) LIKE ?
               OR LOWER(o.title) = ?
            LIMIT 10
        `;

            const searchPatterns = [
                `%${normalizedJobTitle}%`,  // Contains the search term
                `${normalizedJobTitle}%`,   // Starts with the search term
                normalizedJobTitle          // Exact match
            ];

            const [results] = await db.promise().query(query, searchPatterns);

            if (results.length > 0) {
                // Return the search results directly without Levenshtein distance
                return {
                    status: 200,
                    matches: results.map(result => ({
                        code: result.onetsoc_code,
                        title: result.title
                    }))
                };
            }
            // Query using direct title comparison and LIKE operator
            const queryAlternate = `
            SELECT 
                o.onetsoc_code,
                o.alternate_title
            FROM alternate_titles o 
            WHERE LOWER(o.alternate_title) LIKE ?
               OR LOWER(o.alternate_title) LIKE ?
               OR LOWER(o.alternate_title) = ?
            LIMIT 10
        `;

            const searchPatternsAlternate = [
                `%${normalizedJobTitle}%`,  // Contains the search term
                `${normalizedJobTitle}%`,   // Starts with the search term
                normalizedJobTitle          // Exact match
            ];

            const [resultsAlternate] = await db.promise().query(query, searchPatternsAlternate);

            if (resultsAlternate.length > 0) {
                // Return the search results directly without Levenshtein distance
                return {
                    status: 200,
                    matches: resultsAlternate.map(result => ({
                        code: result.onetsoc_code,
                        title: result.title
                    }))
                };
            }
            return {
                status: 404,
                message: "No similar occupations found."
            };
        } catch (err) {
            return {
                status: 500,
                error: "Failed to search for similar occupations."
            };
        }
    },

    getWorkStyles: async (occupation_id) => {
        const query = `
        SELECT ws.onetsoc_code, ws.element_id, ws.scale_id, ws.data_value, ws.n, ws.standard_error, 
               ws.lower_ci_bound, ws.upper_ci_bound, ws.recommend_suppress, ws.date_updated, ws.domain_source, 
               cmr.element_name, cmr.description
        FROM work_styles ws
        JOIN content_model_reference cmr
          ON ws.element_id = cmr.element_id
        WHERE ws.onetsoc_code = ?;
    `;

        try {
            const results = await new Promise((resolve, reject) => {
                db.query(query, [occupation_id], (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve the promise with the results
                    }
                });
            });

            return results; // Return the results if successful
        } catch (error) {
            throw error; // Re-throw the error to be caught by the caller
        }
    },
    getWorkActivities: async (occupation_id) => {
        const query = `
        SELECT ws.onetsoc_code, ws.element_id, ws.scale_id, ws.data_value, ws.n, ws.standard_error,
               ws.lower_ci_bound, ws.upper_ci_bound, ws.recommend_suppress, ws.date_updated, ws.domain_source,
               cmr.element_name, cmr.description
        FROM work_activities ws
        JOIN content_model_reference cmr
          ON ws.element_id = cmr.element_id
        WHERE ws.onetsoc_code = ?;
    `;

        try {
            const results = await new Promise((resolve, reject) => {
                db.query(query, [occupation_id], (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve the promise with the results
                    }
                });
            });

            return results; // Return the results if successful
        } catch (error) {
            throw error; // Re-throw the error to be caught by the caller
        }
    },
    getWorkValues: async (occupation_id) => {
        const query = `
         SELECT ws.onetsoc_code, ws.element_id, ws.scale_id, ws.data_value, 
               cmr.element_name, cmr.description
        FROM work_values ws
        JOIN content_model_reference cmr
          ON ws.element_id = cmr.element_id
        WHERE ws.onetsoc_code = ?;
    `;

        try {
            const results = await new Promise((resolve, reject) => {
                db.query(query, [occupation_id], (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve the promise with the results
                    }
                });
            });

            return results; // Return the results if successful
        } catch (error) {
            throw error; // Re-throw the error to be caught by the caller
        }
    },
    getSkills: async (occupation_id) => {
        const query = `
       SELECT ws.onetsoc_code, ws.element_id, ws.scale_id, ws.data_value, ws.n, ws.standard_error,
               ws.lower_ci_bound, ws.upper_ci_bound, ws.recommend_suppress, ws.date_updated, ws.domain_source,
               cmr.element_name, cmr.description
        FROM skills ws
        JOIN content_model_reference cmr
          ON ws.element_id = cmr.element_id
        WHERE ws.onetsoc_code = ?;
    `;

        try {
            const results = await new Promise((resolve, reject) => {
                db.query(query, [occupation_id], (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve the promise with the results
                    }
                });
            });

            return results; // Return the results if successful
        } catch (error) {
            throw error; // Re-throw the error to be caught by the caller
        }
    },
    getAbilities: async (occupation_id) => {
        const query = `
       SELECT ws.onetsoc_code, ws.element_id, ws.scale_id, ws.data_value, ws.n, ws.standard_error,
               ws.lower_ci_bound, ws.upper_ci_bound, ws.recommend_suppress, ws.date_updated, ws.domain_source,
               cmr.element_name, cmr.description
        FROM abilities ws
        JOIN content_model_reference cmr
          ON ws.element_id = cmr.element_id
        WHERE ws.onetsoc_code = ?;
    `;

        try {
            const results = await new Promise((resolve, reject) => {
                db.query(query, [occupation_id], (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve the promise with the results
                    }
                });
            });

            return results; // Return the results if successful
        } catch (error) {
            throw error; // Re-throw the error to be caught by the caller
        }
    },
    getTechnologySkills: async (occupation_id) => {
        const query = `
          SELECT *
                FROM technology_skills
                WHERE onetsoc_code = ?
                AND hot_technology = 'Y'
                AND in_demand = 'Y';
    `;

        try {
            const results = await new Promise((resolve, reject) => {
                db.query(query, [occupation_id], (error, results) => {
                    if (error) {
                        reject(error); // Reject the promise if there's an error
                    } else {
                        resolve(results); // Resolve the promise with the results
                    }
                });
            });

            return results; // Return the results if successful
        } catch (error) {
            throw error; // Re-throw the error to be caught by the caller
        }
    },
    getKnowledge: async (occupation_id) => {
        const query = `
      SELECT 
          j.job_zone AS job_zone_value, 
          jz.name AS job_zone_title, 
          jz.education AS job_zone_education, 
          jz.experience AS job_zone_related_experience, 
          jz.job_training AS job_zone_job_training, 
          jz.examples AS job_zone_examples, 
          jz.svp_range AS job_zone_svp_range,

          e.category AS education_category, 
          e.data_value AS education_score,

          cmr.element_name AS knowledge_name, 
          cmr.description AS knowledge_description
      FROM education_training_experience e
      LEFT JOIN job_zones j ON e.onetsoc_code = j.onetsoc_code
      LEFT JOIN job_zone_reference jz ON j.job_zone = jz.job_zone
      LEFT JOIN knowledge k ON e.onetsoc_code = k.onetsoc_code
      LEFT JOIN content_model_reference cmr ON cmr.element_id = k.element_id
      WHERE e.onetsoc_code = ?
        AND e.recommend_suppress = 'N'
        AND e.data_value > 0
      ORDER BY e.data_value DESC
      LIMIT 5;
    `;

        try {
            const results = await new Promise((resolve, reject) => {
                db.query(query, [occupation_id], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });

            // Process the query results to match the desired JSON format
            const jobZoneDetails = results.length > 0 ? {
                value: results[0].job_zone_value,
                title: results[0].job_zone_title,
                education: results[0].job_zone_education,
                related_experience: results[0].job_zone_related_experience,
                job_training: results[0].job_zone_job_training,
                job_zone_examples: results[0].job_zone_examples,
                svp_range: results[0].job_zone_svp_range,
            } : null;

            const educationDetails = results.reduce((acc, curr) => {
                acc.level_required.category.push({
                    name: curr.education_category,
                    score: {
                        scale: "Percentage of Respondents",
                        value: curr.education_score,
                    },
                });
                return acc;
            }, { level_required: { category: [] } });

            const knowledgeDetails = results.map((row) => ({
                name: row.knowledge_name,
                description: row.knowledge_description,
            }));

            return {
                job_zone: jobZoneDetails,
                education: educationDetails,
                knowledge: knowledgeDetails,
            };
        } catch (error) {
            throw error;
        }
    },
    getRelatedOccupById: (req, res) => {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        JobModel.getJobsByUserId(user_id, (err, results) => {
            if (err) {
                return res.status(500).send({ error: 'Failed to fetch jobs' });
            }
            res.send(results);
        });
    },
    getOccupData: async (title) => {
        try {
            const response = await axios.get(`https://services.onetcenter.org/ws/online/search?keyword=${title}`, {
                headers: {
                    Authorization: 'Basic ' + process.env.ONET_API_KEY,
                },
            });

            // Ensure the response contains occupation data
            if (response.data && response.data.occupation && response.data.occupation.length > 0) {
                return response.data.occupation[0];
            }

            return null; // Return null if no occupation is found
        } catch (error) {
            return null;
        }
    },
};

export default OccupationController;
