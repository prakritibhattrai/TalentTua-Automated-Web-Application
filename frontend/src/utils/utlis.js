export function cosineSimilarity(str1, str2) {
    console.log(str1, str2)
    const tokenize = (str) =>
        str
            .toLowerCase()
            .split(/\s+/)
            .reduce((acc, word) => {
                acc[word] = (acc[word] || 0) + 1;
                return acc;
            }, {});

    const vector1 = tokenize(str1);
    const vector2 = tokenize(str2);

    const intersection = Object.keys(vector1).filter((word) =>
        vector2.hasOwnProperty(word)
    );

    const dotProduct = intersection.reduce(
        (sum, word) => sum + vector1[word] * vector2[word],
        0
    );

    const magnitude1 = Math.sqrt(
        Object.values(vector1).reduce((sum, val) => sum + val ** 2, 0)
    );
    const magnitude2 = Math.sqrt(
        Object.values(vector2).reduce((sum, val) => sum + val ** 2, 0)
    );

    return magnitude1 && magnitude2 ? dotProduct / (magnitude1 * magnitude2) : 0;
}
