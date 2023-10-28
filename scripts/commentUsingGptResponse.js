module.exports = ({github, context}) => {
    
    function tryExtractJson(text, jsonStartMarker, jsonEndMarker) {
        console.log(`Attempting to extract JSON with start marker "${jsonStartMarker}" and end marker "${jsonEndMarker}" from text: ${text}` );
      
        const indexOfJsonStart = text.indexOf(jsonStartMarker);
        if (indexOfJsonStart === -1) {
          console.log("Could not find JSON start marter");
          return null;
        }
        
        const indexOfJsonEnd = text.indexOf(jsonEndMarker, indexOfJsonStart + 1);
        if (indexOfJsonEnd === -1) {
          console.log("Could not find JSON end marter");
          return null;
        }
      
        return text.substring(indexOfJsonStart + jsonStartMarker.length, indexOfJsonEnd);
      } 
      
      function createComment(gptResponseJson) {
        console.log("Extracted JSON: " + gptResponseJson);
        const responseJSON = JSON.parse(gptResponseJson);
      
        const response = "```json\n" + JSON.stringify(responseJSON, null, 2) + "\n```";
        github.rest.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.issue.number,
          body: response
        });
      }

    const fs = require('fs')
    const gptResponse = fs.readFileSync(process.env.GITHUB_WORKSPACE + "/gpt-auto-comment.output", 'utf8')

    const jsonStartMarker = "```json"
    const jsonEndMarker = "```"

    json = tryExtractJson(gptResponse, jsonStartMarker, jsonEndMarker);
    if (json !== null) {
        createComment(json);
        return;
    }

    json = tryExtractJson(gptResponse, jsonEndMarker, jsonEndMarker) // sometimes GPT will return the JSON in the form of ``` {} ```
    if (json !== null) {
        createComment(json);
        return;
    }

    console.log("Could not find JSON markers in GPT output, assuming raw JSON");
    createComment(gptResponse);
}