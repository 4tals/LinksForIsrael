module.exports = async ({github, context}) => {

  const fs = require('fs').promises;
  const cp = require('child_process');

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
  
  async function createOrUpdatePullRequest(branch, name) {

    const existingResponse = await github.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      head: `${context.repo.owner}:${branch}`,
      base: 'main',
    })
    console.log("existing PRs: " + JSON.stringify(existingResponse));

    existingPrs = existingResponse.data
    if (existingPrs && existingPrs.length > 0) {
      console.log("At least one PR exists for this branch");
      existingPrs[0].existing = true;
      return existingPrs[0];
    }
    
    const newResponse  = await github.rest.pulls.create({
      title: `New Initiative: ${name} [Suggested by ${process.env.ISSUE_AUTHOR}]`,
      owner: context.repo.owner,
      repo: context.repo.repo,
      head: branch,
      base: 'main',
      body: `closes #${context.issue.number}\n**IMPORTANT: Only merge after validating the initiative and double checking the generated JSON**`
    });
    console.log("Created new PR: " + JSON.stringify(newResponse));

    return newResponse.data
  }
  
  async function createComment(body) {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: body
    });
  }

  async function warnAndComment(warning, exception, json) {
    console.warn(`${warning} [${exception}]`);
    await createComment(`**WARNING**: ${warning}
see GitHub Action logs for more details: ${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}
Automatic PR will NOT be generated
${json}`);
  }

  function executeGitCommand(args) {
    console.log(`Executing: git ${args}`);
    cp.execFileSync("git", args);
  }

  const tempFolder = process.env.TEMP || "/tmp";
  const gptResponse = await fs.readFile(tempFolder + "/gpt-auto-comment.output", "utf8");

  // https://stackoverflow.com/a/51602415/67824
  const sanitizedGptResponse = gptResponse.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  console.log("Sanitized GPT response: " + sanitizedGptResponse);

  const jsonStartMarker = "```json";
  const jsonEndMarker = "```";
  jsonString = tryExtractJson(sanitizedGptResponse, jsonStartMarker, jsonEndMarker) || tryExtractJson(sanitizedGptResponse, jsonEndMarker, jsonEndMarker);
  if (jsonString == null) {
    console.log("Could not find JSON markers in GPT output, assuming raw JSON");
    jsonString = sanitizedGptResponse;
  }
  console.log("Extracted JSON: " + jsonString);

  try {
    json = JSON.parse(jsonString);
  } 
  catch (e) {
    return await warnAndComment("Could not process GPT response as JSON", e, jsonString);
  }

  humanReadableJson = "```json\n" + JSON.stringify(json, null, 2) + "\n```";
  
  let categoryLinksJsonFile, categoryJsonString;
  try {
    categoryLinksJsonFile = `${process.env.GITHUB_WORKSPACE}/_data/links/${json.category}/links.json`;
    console.log("resolved category links file: " + categoryLinksJsonFile);

    categoryJsonString = await fs.readFile(categoryLinksJsonFile, "utf8");
    categoryJson = JSON.parse(categoryJsonString);
  }
  catch (e) {
    return await warnAndComment("Could not process category links JSON", e, humanReadableJson);
  }

  delete json.category //not in our schema, and worse - will interfere with the existing initiative detection below

  if (process.env.ISSUE_TITLE.toLocaleUpperCase("en-us").startsWith("[NEW-INITIATIVE-FORCE-PR]:")) {
    console.warn("FORCE-PR requested: skipping existing initiative validation");
  }
  else {
    console.log("Attempting to detect already existing initiative under this category");

    const upperCategoryJsonString = categoryJsonString.toLocaleUpperCase("en-us");
    for (const prop in json) {
      
      const value = json[prop];
      if (typeof value !== "string" || value == "") {
        continue;
      }
  
      const PropValueUpper = value.toLocaleUpperCase("en-us");
      if (upperCategoryJsonString.indexOf(PropValueUpper) !== -1) {
        return await warnAndComment(
          `Initiative might already exist under this category - the value of property \`${prop}\` is already present in the JSON \`${value}\`. 
If you are certain this initiative doesn't exist, edit the issue's title so that it starts with \`[NEW-INITIATIVE-FORCE-PR]:\``,
           "suspected existing initiative",
            humanReadableJson);
      }
    }
  }
  
  categoryJson.links.push(json);
  await fs.writeFile(categoryLinksJsonFile, JSON.stringify(categoryJson, null, 2), "utf8");

  const branch = `auto-pr-${context.issue.number}`;
  try {
    executeGitCommand(["config", "user.name", "github-actions"])
    executeGitCommand(["config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]) //https://github.com/orgs/community/discussions/26560
    executeGitCommand(["checkout", "-b", branch])
    executeGitCommand(["add", categoryLinksJsonFile])
    executeGitCommand(["commit", "-m", json.name || "new initiative"])
    executeGitCommand(["push", "origin", branch, "--force"])
  }
  catch (e) {
    return await warnAndComment("encountered error during git execution", e, humanReadableJson);
  }

  let pr;
  try {
    pr = await createOrUpdatePullRequest(branch, json.name || "???");
  }
  catch (e) {
    return await warnAndComment("Could not create pull request", e, humanReadableJson);
  }

  console.log("resolved PR: " + JSON.stringify(pr))
  createComment((pr.existing ? "Updated" : "Created") + " PR: " + pr.html_url);
}
