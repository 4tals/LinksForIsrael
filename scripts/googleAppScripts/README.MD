# Google Apps Scripts for LinksForIsrael

This directory contains Google Apps Scripts used to automate tasks related to the LinksForIsrael project's operations.

## Scripts

- `SheetToGithubIssue.gs`: This script is triggered upon form submissions to a Google Sheet and creates corresponding issues in the LinksForIsrael GitHub repository.

## Setup

To use these scripts:

1. Open the Google Sheet that is collecting form responses.
2. Click on `Extensions > Apps Script` to open the Apps Script editor.
3. Copy the contents of the `.gs` files into the editor.

## Authentication

The `SheetToGithubIssue.gs` script requires a GitHub personal access token (PAT) with the `public_repo` scope to create issues in the repository.

### Storing Your GitHub Token

- Store your GitHub token securely using the Apps Script's user properties:
  ```javascript
  function setGithubCredentials() {
    setPersonalGithubToken();
    setGithubRepositoryName();
  }
  
  function setPersonalGithubToken() {
    var personalGithubToken = 'YOUR_ACTUAL_GITHUB_TOKEN'; // Replace with your actual token
    PropertiesService.getUserProperties().setProperty('GITHUB_TOKEN', personalGithubToken);
  }
  
  function setGithubRepositoryName() {
    var repositoryName = '4tals/LinksForIsrael'; // Replace with your repository name
    PropertiesService.getUserProperties().setProperty('GITHUB_REPOSITORY', repositoryName);
  }
  ```
- Execute the `setPersonalGithubToken` function once to store your token.

### Retrieving Your GitHub Token and Repository Name in the Script

- Retrieve your GitHub token and repository name within the script using:
  ```javascript
  var githubToken = PropertiesService.getUserProperties().getProperty('GITHUB_TOKEN');
  var repositoryName = PropertiesService.getUserProperties().getProperty('GITHUB_REPOSITORY');
  ```

**⚠️ Security Note:** Never hard-code your `GITHUB_TOKEN` in your script. Store it securely in user properties and ensure the script accesses the token as shown above.

**Note**: Replace 'YOUR_GITHUB_TOKEN' with your actual GitHub token and '4tals/LinksForIsrael' with your actual GitHub repository name when setting it up for the first time.

## Usage

To manually trigger the script for testing purposes:

1. Within the Apps Script editor, select the `testOnFormSubmit` function.
2. Click the run button to execute the script.
3. Verify that the GitHub issue has been created with the correct labels and information.

**Note:** Replace 'YOUR_ACTUAL_GITHUB_TOKEN' with your actual GitHub token when you run the `setPersonalGithubToken` function.