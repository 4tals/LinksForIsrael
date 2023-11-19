require('dotenv').config();

const context = {
    serverUrl: "https://github.com",
    runId: process.env.GITHUB_RUN_ID,
    repo: {
        owner: process.env.GITHUB_OWNER,
        repo:  process.env.GITHHUB_REPO
    },
    issue: {
        number: process.env.GITHUB_ISSUE_NUMBER
    }
};

const { Octokit } = require("@octokit/rest");

const github = new Octokit({
    auth: process.env.GITHUB_PAT,  // Make sure the environment variable is named correctly here
});

// Assuming generatePullRequestForNewInitiative.js is using module.exports
const script = require('./generatePullRequestForNewInitiative.js');
script({ github, context });
