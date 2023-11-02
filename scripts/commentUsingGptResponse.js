module.exports = ({github, context}) => {
  function tryExtractJson(text, jsonStartMarker, jsonEndMarker) {
    console.log(`Attempting to extract JSON with start marker "${jsonStartMarker}" and end marker "${jsonEndMarker}"` );
  
    const indexOfJsonStart = text.indexOf(jsonStartMarker);
    if (indexOfJsonStart === -1) {
      console.log("Could not find JSON start marker");
      return null;
    }
    
    const indexOfJsonEnd = text.indexOf(jsonEndMarker, indexOfJsonStart + 1);
    if (indexOfJsonEnd === -1) {
      console.log("Could not find JSON end marker");
      return null;
    }
  
    return text.substring(indexOfJsonStart + jsonStartMarker.length, indexOfJsonEnd);
  } 
  
  function createComment(gptResponseJson) {
    console.log("Extracted JSON: " + gptResponseJson);

    try {
      humanReadableJson = JSON.stringify(JSON.parse(gptResponseJson), null, 2);
    } 
    catch (e) {
      console.warn("Could not process JSON: " + e);
      humanReadableJson = "// WARNING: THIS IS MOST LIKELY INVALID JSON, PLEASE REVIEW MANUALLY \n" + gptResponseJson;
    }
  
    console.log("Human readable JSON: " + humanReadableJson);
    github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: "```json\n" + humanReadableJson + "\n```"
    });
  }

  const fs = require('fs')
  const tempFolder = process.env.TEMP || "/tmp"
  const gptResponse = fs.readFileSync(tempFolder + "/gpt-auto-comment.output", "utf8")

  // https://stackoverflow.com/a/51602415/67824
  var sanitizedGptResponse = gptResponse.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
  const jsonStartMarker = "```json"
  const jsonEndMarker = "```"

  console.log("Sanitized GPT response: " + sanitizedGptResponse)
  
  json = tryExtractJson(sanitizedGptResponse, jsonStartMarker, jsonEndMarker);
  if (json !== null) {
      createComment(json);
      return;
  }

  json = tryExtractJson(sanitizedGptResponse, jsonEndMarker, jsonEndMarker) // sometimes GPT will return the JSON in the form of ``` {} ```
  if (json !== null) {
      createComment(json);
      return;
  }

  console.log("Could not find JSON markers in GPT output, assuming raw JSON");
  createComment(sanitizedGptResponse);
}