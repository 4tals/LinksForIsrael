# Google App Scripts for LinksForIsrael

This directory contains Google App Scripts used to automate tasks related to LinksForIsrael operations.

## Scripts

- `SheetToGithubIssue.gs`: This script triggers on form submissions to a Google Sheet and creates corresponding issues in the LinksForIsrael GitHub repository.

## Setup

To use these scripts:

1. Open the Google Sheet that is collecting form responses.
2. Click on `Extensions > Apps Script` to open the Apps Script editor.
3. Copy the contents of the `.gs` files into the editor.
4. Set up your GitHub token in the script properties:
    - In the Apps Script editor, click on `File > Project properties > Script properties`.
    - Add a new property with the name `GITHUB_TOKEN` and paste your GitHub personal access token as the value.
5. Save and deploy the script as a web app or bound script, depending on your needs.

**⚠️ Security Note:** Do not hard-code your `GITHUB_TOKEN` in your script. Always store and access it using script properties to keep it secure.

## Authentication

The `SheetToGithubIssue.gs` script requires a GitHub personal access token (PAT) with the appropriate permissions to create issues in your repository.

## Usage

To manually trigger the script for testing purposes:

1. Within the Apps Script editor, select the `testOnFormSubmit` function.
2. Click the run button to execute the script.
3. Verify that the GitHub issue has been created with the correct labels and information.
