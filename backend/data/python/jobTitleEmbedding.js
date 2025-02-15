import { exec } from "child_process";

/**
 * Get job title similarity by calling the Python script
 * @param {string} userInput - The job title input
 * @returns {Promise<object>} - Resolves to an object with job title match and similarity score
 */
export const getJobTitleSimilarity = async (userInput) => {
    return new Promise((resolve, reject) => {
        exec(`python3 ./data/python/bert_python.py "${userInput}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject("Error processing job title match");
                return;
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject("Python script execution error");
                return;
            }

            try {
                const result = JSON.parse(stdout.trim()); // Ensure it's valid JSON
                resolve(result); // Return the parsed JSON data
            } catch (parseError) {
                console.error(`Error parsing Python output: ${parseError}`);
                reject("Error parsing Python response");
            }
        });
    });

};

