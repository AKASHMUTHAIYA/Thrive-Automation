const { minimatch } = require('minimatch');
const path = require('path');

function normalizeGitPath(filePath) {
  return filePath.replace(/\\/g, '/').replace(/^\.\//, '');
}

function buildImpactedTestList(changedFiles, mapping, maxTests = 5) {
  const selected = new Set();
  const normalizedChangedFiles = changedFiles.map(normalizeGitPath);
  const mapKeys = Object.keys(mapping).filter((key) => key !== '__default__');

  for (const changedFile of normalizedChangedFiles) {
    for (const key of mapKeys) {
      if (changedFile === key || minimatch(changedFile, key, { dot: true })) {
        const tests = mapping[key];
        if (Array.isArray(tests)) {
          tests.forEach((testFile) => selected.add(normalizeGitPath(testFile)));
        }
      }
    }
  }

  if (selected.size === 0 && Array.isArray(mapping.__default__)) {
    mapping.__default__.forEach((testFile) => selected.add(normalizeGitPath(testFile)));
  }

  return [...selected].slice(0, maxTests);
}

function buildPrComment(changedFiles, impactedTests, exitCode, summary) {
  return [
    `### PR Review Automation Results`,
    `- Changed files detected: ${changedFiles.length}`,
    `- Impacted smoke tests selected: ${impactedTests.length}`,
    `- Selected tests: ${impactedTests.length ? impactedTests.join(', ') : 'No impacted tests found'}`,
    `- Result: ${exitCode === 0 ? '✅ Passed' : '❌ Failed'}`,
    `- Allure report available as workflow artifact if the workflow completed.`,
    '',
    '#### Summary',
    summary || 'No summary available.',
  ].join('\n');
}

module.exports = {
  normalizeGitPath,
  buildImpactedTestList,
  buildPrComment,
};
