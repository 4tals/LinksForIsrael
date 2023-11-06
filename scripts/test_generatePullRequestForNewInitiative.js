const context = {
    serverUrl: "https://github.com",
    runId: 6762019754,
    repo: {
        owner: "ohadschn",
        repo: "ConnectPortal"
    },
    issue: {
        number: 10
    }
}

const { Octokit } = require("@octokit/rest");

const github = new Octokit({
    auth: process.env.GITHHUB_PAT,
});

const script = require('./generatePullRequestForNewInitiative.js')
script({ github, context })