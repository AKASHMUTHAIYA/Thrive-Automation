const axios = require('axios');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_BASE = process.env.GITHUB_API_URL || 'https://api.github.com';
const REPOSITORY = process.env.GITHUB_REPOSITORY || '';

function parseRepository(repository = REPOSITORY) {
  if (!repository) {
    throw new Error('GITHUB_REPOSITORY is not set. Example format: owner/repo');
  }

  const [owner, repo] = repository.split('/');
  if (!owner || !repo) {
    throw new Error(`Invalid GITHUB_REPOSITORY value: ${repository}`);
  }
  return { owner, repo };
}

function getAuthHeaders() {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is required to call GitHub API. Set it in .env or in GitHub Actions.');
  }
  return {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  };
}

async function getChangedFiles(prNumber, repository) {
  const { owner, repo } = parseRepository(repository);
  const changedFiles = [];
  let page = 1;

  while (true) {
    try {
      const response = await axios.get(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls/${prNumber}/files`,
        {
          headers: getAuthHeaders(),
          params: { per_page: 100, page },
        },
      );

      const files = response.data.map((item) => item.filename.replace(/\\/g, '/'));
      changedFiles.push(...files);

      if (files.length < 100) {
        break;
      }
      page += 1;
    } catch (error) {
      const message = error.response
        ? `GitHub API failed (${error.response.status}): ${JSON.stringify(error.response.data)}`
        : error.message;
      throw new Error(`Failed to fetch PR changed files: ${message}`);
    }
  }

  return Array.from(new Set(changedFiles));
}

async function createPRComment(prNumber, message, repository) {
  const { owner, repo } = parseRepository(repository);

  try {
    const response = await axios.post(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${prNumber}/comments`,
      { body: message },
      { headers: getAuthHeaders() },
    );

    return response.data;
  } catch (error) {
    const message = error.response
      ? `GitHub comment API failed (${error.response.status}): ${JSON.stringify(error.response.data)}`
      : error.message;
    throw new Error(`Failed to post PR comment: ${message}`);
  }
}

module.exports = {
  getChangedFiles,
  createPRComment,
};
