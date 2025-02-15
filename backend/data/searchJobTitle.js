import natural from 'natural';
import leven from 'leven';
import fs from 'fs';

// Read job titles from JSON file
const filePath = './data/titles.json';
const jobList = JSON.parse(fs.readFileSync(filePath, 'utf8')).filter(job => job.alternate_title);

/**
 * Find the best matching job title using Exact, Fuzzy, and Semantic matching.
 * @param {string} userJobTitle - The job title input by the user.
 * @returns {object} The best-matching job title with match type, score, title, and onetsoc_code.
 */
export const findBestJobMatch = (userJobTitle) => {
    if (!userJobTitle || jobList.length === 0) {
        return { matchedTitle: null, matchType: "No Match Found", score: 0, title: null, onetsoc_code: null };
    }

    // Convert user input to lowercase for case-insensitive comparison
    const normalizedInput = userJobTitle.toLowerCase();
    const tokenizer = new natural.WordTokenizer();
    const inputTokens = tokenizer.tokenize(normalizedInput);

    let bestMatch = { matchedTitle: null, matchType: "No Match Found", score: 0, title: null, onetsoc_code: null };
    let minDistance = Infinity;
    let maxSimilarity = 0;
    let bestFuzzyMatch = null;
    let bestSemanticMatch = null;

    // Loop through each job title in the list
    for (let job of jobList) {
        const title = job.alternate_title.toLowerCase(); // Normalize title
        const onetsoc_code = job.onetsoc_code || null; // Get onetsoc_code if exists

        /*** Step 1: Exact Match ***/
        if (title === normalizedInput) {
            return { matchedTitle: title, matchType: "Exact Match", score: 1.0, title: job.alternate_title, onetsoc_code };
        }

        /*** Step 2: Fuzzy Match (Levenshtein Distance) ***/
        const distance = leven(normalizedInput, title);
        const fuzzyScore = 1 - (distance / Math.max(title.length, normalizedInput.length));

        // Track best fuzzy match
        if (fuzzyScore > bestFuzzyMatch?.score || !bestFuzzyMatch) {
            bestFuzzyMatch = { matchedTitle: title, matchType: "Fuzzy Match", score: fuzzyScore, title: job.alternate_title, onetsoc_code };
        }

        /*** Step 3: Semantic Match (Token Overlap - Jaccard Similarity) ***/
        const titleTokens = tokenizer.tokenize(title);
        const commonTokens = inputTokens.filter(token => titleTokens.includes(token));
        const similarityScore = commonTokens.length / new Set([...inputTokens, ...titleTokens]).size;

        // Track best semantic match
        if (similarityScore > maxSimilarity) {
            maxSimilarity = similarityScore;
            bestSemanticMatch = { matchedTitle: title, matchType: "Semantic Match", score: similarityScore, title: job.alternate_title, onetsoc_code };
        }
    }

    /*** Return the best match based on the highest confidence score ***/
    // Check for fuzzy threshold (allowing higher confidence for longer titles)
    const fuzzyThreshold = normalizedInput.length > 10 ? 0.8 : 0.7;

    // Return the highest scoring match
    if (bestFuzzyMatch && bestFuzzyMatch.score >= fuzzyThreshold) {
        return bestFuzzyMatch;
    }

    if (bestSemanticMatch && bestSemanticMatch.score > 0.1) {
        return bestSemanticMatch;
    }

    // Default: Return the best match (fuzzy or semantic) if no exact match
    return bestMatch;
};
