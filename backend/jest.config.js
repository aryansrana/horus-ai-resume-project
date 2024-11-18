/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  // Only match test files in the 'dist' directory
  testMatch: ["**/dist/**/*.test.js"],

  // Ignore source files and node_modules
  testPathIgnorePatterns: ["/node_modules/", "/src/"],

  // Use Node environment
  testEnvironment: "node",
};
