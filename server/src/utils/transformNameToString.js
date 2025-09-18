const transformNameToString = (inputString) => {
    return inputString
        .trim() // Trim leading and trailing spaces
        .toLowerCase() // Convert to lowercase
        .replace(/_/g, " "); // Replace all underscores with spaces
};

module.exports = transformNameToString;
