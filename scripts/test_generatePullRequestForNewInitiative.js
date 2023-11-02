const context = {
    repo: {
        owner: "ohadschn",
        repo: "ConnectPortal"
    },
    issue: {
        number: 13
    }
}

const { Octokit } = require("@octokit/rest");

const github = new Octokit({
    auth: process.env.GITHHUB_PAT,
});

const script = require('./generatePullRequestForNewInitiative.js')
script({ github, context })