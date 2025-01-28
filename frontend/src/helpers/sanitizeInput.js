export const sanitizeInput = (input) => {
    const sanitizedInput = input
        .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
        .replace(/<script.*?>.*?<\/script>/gi, ""); // Remove script tags
    return sanitizedInput.trim();
};

export const validateData = (data) => {
    const errors = [];

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

    if (!Array.isArray(data.desirableSoftSkills) || data.desirableSoftSkills.length === 0) {
        errors.push("At least one desirable soft skill is required.");
    }

    if (!Array.isArray(data.undesirableTraits) || data.undesirableTraits.length === 0) {
        errors.push("At least one undesirable trait is required.");
    }

    if (!Array.isArray(data.toolProficiencies) || data.toolProficiencies.length === 0) {
        errors.push("At least one tool proficiency is required.");
    }

    return errors;
};
