// src/helpers/sanitizeInput.js
export const sanitizeInput = (input) => {
    const sanitizedInput = input
        .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
        .replace(/<script.*?>.*?<\/script>/gi, ""); // Remove script tags
    return sanitizedInput.trim();
};

export const validateData = (data) => {
    // Initialize an array to collect errors
    const errors = [];

    // Check for required fields (adjusted for your structure)
    if (!data?.jobTitle?.jobTitle?.trim() &&
        !data?.jobTitle?.occupation?.title?.trim() &&
        !data?.jobTitle?.selectedJobTitle?.trim()) {
        errors.push("Job title is required.");
    }

    if (!data.jobFamily || data.jobFamily.trim() === "") {
        errors.push("Job family is required.");
    }

    if (!data.industry || data.industry.trim() === "") {
        errors.push("Industry is required.");
    }

    if (!data.seniorityLevel || data.seniorityLevel.trim() === "") {
        errors.push("Seniority level is required.");
    }

    if (!data.roleDescription || data.roleDescription.trim() === "") {
        errors.push("Role description is required.");
    }

    // Validate if traitMatrix values are correctly set (null or valid number values)
    // Object.keys(data.traitMatrix).forEach((key) => {
    //     const value = data.traitMatrix[key];
    //     if (value !== null && typeof value !== "number") {
    //         errors.push(`${key} must be a number or null.`);
    //     }
    // });

    // Validate if desirableSoftSkills and undesirableTraits are non-empty arrays
    if (!Array.isArray(data.desirableSoftSkills) || data.desirableSoftSkills.length === 0) {
        errors.push("At least one desirable soft skill is required.");
    }

    if (!Array.isArray(data.undesirableTraits) || data.undesirableTraits.length === 0) {
        errors.push("At least one undesirable trait is required.");
    }

    // Validate toolProficiencies to ensure it is an array and contains values
    if (!Array.isArray(data.toolProficiencies) || data.toolProficiencies.length === 0) {
        errors.push("At least one tool proficiency is required.");
    }

    // Return the array of errors (empty if valid)
    return errors;
};
