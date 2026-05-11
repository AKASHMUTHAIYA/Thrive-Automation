const { spawnSync } = require('child_process');
const path = require('path');
const minimist = require('minimist');
const { getChangedFiles, createPRComment } = require('./github');
const { buildImpactedTestList, buildPrComment } = require('./utils/test-utils');
require('dotenv').config();

const mapping = require('./mapping.json');

function getPrNumberFromEnv() {
  const envPr = process.env.PR_NUMBER || process.env.GITHUB_REF_NAME || process.env.GITHUB_HEAD_REF;
  if (envPr && /^[0-9]+$/.test(envPr)) {
    return Number(envPr);
  }
  return undefined;
}

function getRepositoryFromEnv() {
  return process.env.GITHUB_REPOSITORY || null;
}

function generateAllureReport() {
  console.log('Generating Allure report...');
  const allureProcess = spawnSync('npx', ['allure', 'generate', 'allure-results', '-o', 'allure-report', '--clean'], {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  if (allureProcess.status !== 0) {
    throw new Error('Allure report generation failed');
  }
}

function runPlaywrightTests(testFiles) {
  const args = ['playwright', 'test', ...testFiles, '--grep', '@smoke'];

  console.log('Running impacted smoke tests:', testFiles);

  const result = spawnSync('npx', args, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  return result.status === 0 ? 0 : result.status || 1;
}

async function runImpactedTests({ prNumber, repository, commitSha, reportOnly = false, skipAllure = false, maxTests = 5 }) {
  if (!prNumber) {
    prNumber = getPrNumberFromEnv();
  }

  if (!repository) {
    repository = getRepositoryFromEnv();
  }

  if (!prNumber || !repository) {
    throw new Error('PR number and repository must be provided via arguments or environment variables.');
  }

  console.log(`Fetching changed files for PR #${prNumber} in ${repository}`);
  const changedFiles = await getChangedFiles(prNumber, repository);
  const impactedTests = buildImpactedTestList(changedFiles, mapping, maxTests);

  if (impactedTests.length === 0) {
    const summary = 'No impacted smoke tests could be mapped from changed files. This avoids running the full suite.';
    console.log(summary);

    if (!reportOnly) {
      try {
        const comment = buildPrComment(changedFiles, impactedTests, 0, summary);
        await createPRComment(prNumber, comment, repository);
        console.log('PR comment posted successfully for no impacted tests.');
      } catch (error) {
        console.warn('Could not post PR comment for no impacted tests:', error.message);
      }
    }

    return {
      changedFiles,
      selectedTests: [],
      exitCode: 0,
      summary,
    };
  }

  const exitCode = runPlaywrightTests(impactedTests);

  if (!skipAllure) {
    try {
      generateAllureReport();
    } catch (error) {
      console.warn('Allure generation skipped because the command failed:', error.message);
    }
  }

  const summary = `Completed ${impactedTests.length} smoke test(s) with status ${exitCode === 0 ? 'PASS' : 'FAIL'}.`;

  if (!reportOnly) {
    try {
      const comment = buildPrComment(changedFiles, impactedTests, exitCode, summary);
      await createPRComment(prNumber, comment, repository);
      console.log('PR comment posted successfully.');
    } catch (error) {
      console.warn('Could not post PR comment:', error.message);
    }
  }

  return {
    changedFiles,
    selectedTests: impactedTests,
    exitCode,
    summary,
  };
}

async function main() {
  const argv = minimist(process.argv.slice(2), {
    string: ['repository', 'commitSha'],
    alias: { p: 'prNumber', r: 'repository', c: 'commitSha' },
  });

  const result = await runImpactedTests({
    prNumber: argv.prNumber ? Number(argv.prNumber) : undefined,
    repository: argv.repository,
    commitSha: argv.commitSha,
    reportOnly: argv['report-only'] || false,
  });

  process.exit(result.exitCode);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('PR review automation failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  runImpactedTests,
};
