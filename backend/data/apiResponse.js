import JobController from "../controllers/jobController.js";

export const getOptimalData = async (response) => {
    let occupationData = {
        niceToHave: {
            work_styles: [],
            work_values: [],
            interests: [],
            abilities: [],
            skills: []
        },
        educationExpertise: {
            knowledge: [],
            education: [],
            job_zone: {}
        },
        keyProficiencies: {
            technicalSkills: {
                technologies: [],
                tools: [],
                allTechnologies: []
            }
        },
        title: response.occupation?.title || '',
        description: response.occupation?.description || ''
    };


    const extractData = (path) => path ? path.map(item => item.name || item.description || item.title || null).filter(Boolean) : [];

    occupationData.niceToHave.work_styles = extractData(response.work_styles?.element);
    occupationData.niceToHave.work_values = extractData(response.work_values?.element);
    occupationData.niceToHave.abilities = extractData(response.abilities?.element);
    occupationData.niceToHave.interests = extractData(response.interests?.element);
    occupationData.niceToHave.skills = extractData(response.skills?.element);
    occupationData.educationExpertise.knowledge = extractData(response.knowledge?.element);
    occupationData.educationExpertise.education = extractData(response.education?.level_required?.category);
    occupationData.educationExpertise.job_zone = response.job_zone;
    occupationData.keyProficiencies.technicalSkills.technologies = response.technology_skills?.category
    occupationData.keyProficiencies.technicalSkills.tools = response.tools_used?.category
    // const extractTechSkills = (categories) => {
    //     let extractedNames = [];
    //     categories.forEach(category => {
    //         if (category.example && Array.isArray(category.example)) {
    //             category.example.forEach(example => {
    //                 if (example.name) {
    //                     extractedNames.push(example.hot_technology ? `🔥 ${example.name}` : example.name);
    //                 }
    //             });
    //         }
    //     });
    //     return extractedNames;
    // };

    // const techSkills = [];
    // if (response.technology_skills?.category) {
    //     techSkills.push(...extractTechSkills(response.technology_skills.category));
    // }
    // if (response.tools_used?.category) {
    //     techSkills.push(...extractTechSkills(response.tools_used.category));
    // }

    // if (techSkills.length > 0) {
    //     occupationData.keyProficiencies.technicalSkills.tools_and_technology = [...new Set(techSkills)];
    // }

    const isFieldEmpty = (field) => Array.isArray(field) ? field.length === 0 : !field;
    const isOccupationDataIncomplete = Object.values(occupationData.niceToHave).some(isFieldEmpty) ||
        isFieldEmpty(occupationData.educationExpertise.knowledge) ||
        isFieldEmpty(occupationData.educationExpertise.education) ||
        isFieldEmpty(occupationData.keyProficiencies.technicalSkills.technologies);

    if (isOccupationDataIncomplete && (response.occupation?.also_see?.occupation || response.related_occupations?.occupation)) {
        for (const relatedOccupation of [...(response.occupation?.also_see?.occupation || []), ...(response.related_occupations?.occupation || [])]) {
            const additionalData = await JobController.getAPIDetails(relatedOccupation.code);
            console.log(relatedOccupation)
            Object.keys(additionalData).forEach((key) => {
                if (occupationData[key] === undefined) return;
                if (Array.isArray(occupationData[key]) && isFieldEmpty(occupationData[key])) {
                    occupationData[key] = [...new Set(additionalData[key])];
                } else if (typeof occupationData[key] === 'object') {
                    Object.keys(additionalData[key]).forEach((subKey) => {
                        if (Array.isArray(occupationData[key][subKey]) && isFieldEmpty(occupationData[key][subKey])) {
                            occupationData[key][subKey] = [...new Set(additionalData[key][subKey])];
                        }
                    });
                }
            });

            // Re-check if occupationData is now complete
            if (!Object.values(occupationData.niceToHave).some(isFieldEmpty) &&
                !isFieldEmpty(occupationData.educationExpertise.knowledge) &&
                !isFieldEmpty(occupationData.educationExpertise.education) &&
                !isFieldEmpty(occupationData.keyProficiencies.technicalSkills.technologies)) {
                break;
            }
        }
    }

    return occupationData;
};