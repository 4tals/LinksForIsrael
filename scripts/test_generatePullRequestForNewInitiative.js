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
}

const { Octokit } = require("@octokit/rest");

const github = new Octokit({
    auth: process.env.GITHHUB_PAT,
});

const script = require('./generatePullRequestForNewInitiative.js')
script({ github, context })