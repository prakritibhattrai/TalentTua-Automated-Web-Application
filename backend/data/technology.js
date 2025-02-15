import natural from 'natural';
import leven from 'leven';
import fs from 'fs';

const filePath = './data/titles.json';
const techPath = './data/tech.json';

// Read job titles and tools data
const jobList = JSON.parse(fs.readFileSync(filePath, 'utf8')).filter(job => job.alternate_title || job.short_title);
const toolsList = JSON.parse(fs.readFileSync(techPath, 'utf8'));

/**
 * Function to find the best tools and technologies based on the `onetsoc_code`.
 */
export const findBestTechs = (onetsocCode, toolsList) => {
    if (!onetsocCode) return [];

    let matchedTools = toolsList.filter(tool => tool.onetsoc_code === onetsocCode);

    // Sort technologies by hot_technology and in_demand
    matchedTools.sort((a, b) => {
        if (a.hot_technology === "Y" && b.hot_technology !== "Y") return -1;
        if (a.hot_technology !== "Y" && b.hot_technology === "Y") return 1;
        if (a.in_demand === "Y" && b.in_demand !== "Y") return -1;
        if (a.in_demand !== "Y" && b.in_demand === "Y") return 1;
        return 0;
    });

    // Return categorized technologies with emojis
    return {
        hot_technologies: matchedTools.filter(tool => tool.hot_technology === "Y").map(tool => `${tool.example}`),
        in_demand_technologies: matchedTools.filter(tool => tool.in_demand === "Y").map(tool => `${tool.example}`),
        both_hot_and_in_demand: matchedTools.filter(tool => tool.hot_technology === "Y" && tool.in_demand === "Y").map(tool => tool.example)
    };
}

/**
 * Function to find the best matching job title using Exact and Fuzzy matching.
 */
export const findBestJobMatch = (userJobTitle) => {
    console.log(userJobTitle)
    if (!userJobTitle || jobList.length === 0) {
        return { bestMatch: null, onetsoc_code: null, matchType: "No Match Found", score: 0, technologies: {} };
    }

    const normalizedInput = userJobTitle.toLowerCase();
    const tokenizer = new natural.WordTokenizer();
    const inputTokens = tokenizer.tokenize(normalizedInput);

    let bestMatch = { bestMatch: null, onetsoc_code: null, matchType: "No Match Found", score: 0, technologies: {} };
    let minDistance = Infinity;
    let bestFuzzyMatch = null;

    for (let job of jobList) {
        const titles = [job.alternate_title?.toLowerCase(), job.short_title?.toLowerCase()].filter(Boolean);

        for (let title of titles) {
            /*** Step 1: Exact Match ***/
            if (title === normalizedInput) {
                return {
                    bestMatch: job.alternate_title || job.short_title,
                    onetsoc_code: job.onetsoc_code,
                    matchType: "Exact Match",
                    score: 1.0,
                    technologies: findBestTechs(job.onetsoc_code, toolsList)
                };
            }

            /*** Step 2: Fuzzy Match (Levenshtein Distance) ***/
            let distance = leven(normalizedInput, title);
            let fuzzyScore = 1 - (distance / Math.max(title.length, normalizedInput.length));

            if (distance < minDistance) {
                minDistance = distance;
                bestFuzzyMatch = {
                    bestMatch: job.alternate_title || job.short_title,
                    onetsoc_code: job.onetsoc_code,
                    matchType: "Fuzzy Match",
                    score: fuzzyScore
                };
            }
        }
    }

    /*** Return the best fuzzy match with a certain threshold ***/
    let fuzzyThreshold = normalizedInput.length > 10 ? 0.9 : 0.8;
    if (bestFuzzyMatch && bestFuzzyMatch.score >= fuzzyThreshold) {
        return { ...bestFuzzyMatch, technologies: findBestTechs(bestFuzzyMatch.onetsoc_code, toolsList) };
    }

    return bestMatch;
};
