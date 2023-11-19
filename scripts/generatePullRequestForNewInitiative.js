module.exports = async ({github, context}) => {

  const fs = require("fs").promises;
  const path = require("path");
  const cp = require("child_process");

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
  
  async function createOrUpdatePullRequestAsync(branch, name) {

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
  
  async function createCommentAsync(body) {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: body
    });
  }

  async function warnAndCommentAsync(warning, exception, json) {
    console.warn(`${warning} [${exception}]`);
    await createCommentAsync(`**WARNING**: ${warning}

Automatic PR will NOT be generated
\`\`\`json
${JSON.stringify(json, null, 2)}
\`\`\`
See GitHub Action logs for more details: ${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`);
  }

  function executeShellCommand(cmd, args) {
    console.log(`Executing: ${cmd} ${args.join(" ")}`);
    
    let stdout;
    try {
      stdout = cp.execFileSync(cmd, args);
    } 
    catch (e) {
      console.error(`Command executed with non-zero exit code ${e.status}: ${e.message}`);
      console.error(`stdout: ${e.stdout}`);
      console.error(`stderr: ${e.stderr}`);
      throw e;
    }

    console.log(`Command executed successfully with stdout: ${stdout}`);
  }

  function executeGitCommand(args) {
    executeShellCommand("git", args);
  }
  
  function pushPrBranch(branch, categoryLinksJsonFile, initiativeName) {
    executeGitCommand(["config", "user.name", "github-actions"]);
    executeGitCommand(["config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]); //https://github.com/orgs/community/discussions/26560
    executeGitCommand(["checkout", "-b", branch]);
    executeGitCommand(["add", categoryLinksJsonFile]);
    executeGitCommand(["commit", "-m", initiativeName || "new initiative"]);
    executeGitCommand(["push", "origin", branch, "--force"]);
  }

  function removeRedundantInitiativeJsonProperties(json) {
    console.log("Removing redundant initiative JSON properties")

    //not in our links.json schema, and worse - will interfere with existing initiative detection
    delete json.category;

    var redundantValues = new Set([undefined, "", "N/A", "NOTAPPLICABLE", "NOTAVAILABLE", "UNAVAILABLE"])
    for (const prop in json) {
      const value = json[prop];
      if (typeof value !== "string") {
        continue;
      }
      
      // remove whitespace and capitalize
      const PropValueNormalized = value?.replace(/\s/g, "").toLocaleUpperCase("en-us");
      
      if (redundantValues.has(PropValueNormalized)) {
        console.log(`Removing redundant property '${prop}' with value '${value}'`);
        delete json[prop];
      }
    }
  }

  async function* readdirRecursiveAsync(dir, ext) {
    const upperExtension = ext.toLocaleUpperCase("en-us");

    const dirents = await fs.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const absolutePath = path.resolve(dir, dirent.name);
      
      if (dirent.isFile && (path.extname(absolutePath).toLocaleUpperCase("en-us") === upperExtension)) {
        yield absolutePath;
      }
      else if (dirent.isDirectory()) {
        yield* await readdirRecursiveAsync(absolutePath, ext)
      } 
    }
  }

  async function detectExistingInitiativeAsync(newInitiativeJson) {
    console.log("Attempting to detect already-existing initiative");

    const linksFolder = `${process.env.GITHUB_WORKSPACE}/_data/links`;
    for await (const linkJsonFileName of readdirRecursiveAsync(linksFolder, ".json")) {

      console.log(`processing links file: ${linkJsonFileName}`);
      const linksJsonString = await fs.readFile(linkJsonFileName, "utf8");
      const upperlinksJsonString = linksJsonString.toLocaleUpperCase("en-us");

      for (const prop in newInitiativeJson) {
        
        const value = newInitiativeJson[prop];
        if (typeof value !== "string") {
          continue;
        }
    
        const PropValueUpper = value.toLocaleUpperCase("en-us");
        if (upperlinksJsonString.indexOf(PropValueUpper) !== -1) {
          await warnAndCommentAsync(
`Initiative might already exist!
The value of property \`${prop}\` (\`${value}\`) is already present in \`${linkJsonFileName}\`:
\`\`\`json
${linksJsonString}
\`\`\`
**If this is a mistake and it doesn't already exist:** edit the issue's title so that it starts with **\`[FORCE-PR-NEW-INITIATIVE]:\`**`,
             "Suspected existing initiative",
             newInitiativeJson)
          return true;
        }
      }
    }

    return false;
  }

  async function updateExistingInitiativeAsync(categoryJson, newInitiativeJson) {
    const initiativeName = newInitiativeJson.name;

    if (!(initiativeName?.trim())) {
      await warnAndCommentAsync("For update, you must provide a name that matches the name of an existing initiative", "no initiative name provided", newInitiativeJson);
      return false;
    }
    
    const existingCategoryIndex = categoryJson.links.findIndex((link => { link.name?.localeCompare(initiativeName, undefined, { sensitivity: 'accent' }) === 0 } ))
    if (existingCategoryIndex === -1) {
      await warnAndCommentAsync(`Could not find existing initiative '${initiativeName}' in category '${category}'`, "initiative not found", newInitiativeJson);
      return false;
    }

    categoryJson.links[existingCategoryIndex] = newInitiativeJson;
    return true;
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

  let newInitiativeJson;
  try {
    newInitiativeJson = JSON.parse(jsonString);
  } 
  catch (e) {
    return await warnAndCommentAsync("Could not process GPT response as JSON", e, jsonString);
  }

  // saving the category before we delete it from the object
  category = newInitiativeJson.category
  removeRedundantInitiativeJsonProperties(newInitiativeJson); 

  const issueTitleUpper = process.env.ISSUE_TITLE.toLocaleUpperCase("en-us");
  const forceNewInitiative = issueTitleUpper.startsWith("[FORCE-PR-NEW-INITIATIVE]:");
  const updateInitiative = issueTitleUpper.startsWith("[UPDATE-INITIATIVE]:");

  if (forceNewInitiative) {
    console.warn("FORCE-PR requested: skipping existing initiative validation");
  }
  else if (!updateInitiative && await detectExistingInitiativeAsync(newInitiativeJson)) {
    return;
  }
  
  let categoryLinksJsonFile;
  try {
    categoryLinksJsonFile = `${process.env.GITHUB_WORKSPACE}/_data/links/${category}/links.json`;
    console.log("resolved category links file: " + categoryLinksJsonFile);

    const categoryJsonString = await fs.readFile(categoryLinksJsonFile, "utf8");
    categoryJson = JSON.parse(categoryJsonString);
  }
  catch (e) {
    return await warnAndCommentAsync("Could not process category links JSON", e, newInitiativeJson);
  }

  if (updateInitiative) {
    const edited = await updateExistingInitiativeAsync(categoryJson, newInitiativeJson, newInitiativeJson)
    if (!edited) {
      return;
    }
  }
  else {
    categoryJson.links.push(newInitiativeJson);
  }
  
  await fs.writeFile(categoryLinksJsonFile, JSON.stringify(categoryJson, null, 2), "utf8");

  const branch = `auto-pr-${context.issue.number}`;
  try {
    pushPrBranch(branch, categoryLinksJsonFile, newInitiativeJson.name);
  }
  catch (e) {
    return await warnAndCommentAsync("encountered error during git execution", e, newInitiativeJson);
  }

  let pr;
  try {
    pr = await createOrUpdatePullRequestAsync(branch, newInitiativeJson.name || "???");
  }
  catch (e) {
    return await warnAndCommentAsync("Could not create pull request", e, newInitiativeJson);
  }

  console.log("resolved PR: " + JSON.stringify(pr))
  await createCommentAsync((pr.existing ? "Updated" : "Created") + " PR: " + pr.html_url);
}
