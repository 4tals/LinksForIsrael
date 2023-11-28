module.exports = async ({github, context}) => {

  const path = require("path");
  const fs = require("fs");
  const fsAsync = fs.promises;
  const cp = require("child_process");

  const stream = require('stream');
  const streamPromises = require('stream/promises');

  const crypto = require('crypto'); 

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
  
  async function createOrUpdatePullRequestAsync(update, branch, name) {

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
      title: `${update ? "Update" : "New"} Initiative: ${name} [Suggested by ${process.env.ISSUE_AUTHOR}]`,
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
  
  function pushPrBranch(branch, categoryLinksJsonFile, retainedImagePath, initiativeName) {
    executeGitCommand(["config", "user.name", "github-actions"]);
    executeGitCommand(["config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]); //https://github.com/orgs/community/discussions/26560
    executeGitCommand(["checkout", "-b", branch]);
    executeGitCommand(["add", categoryLinksJsonFile]);
    if (retainedImagePath) {
      executeGitCommand(["add", retainedImagePath]);
    }
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

  async function detectExistingInitiativeAsync(newInitiativeJson) {
    console.log("Attempting to detect already-existing initiative");

    const linksFolder = `${process.env.GITHUB_WORKSPACE}/_data/links`;

    const dirents = await fsAsync.readdir(linksFolder, { withFileTypes: true, recursive: true });
    for (const dirent of dirents) {
      const absolutePath = path.resolve(dirent.path, dirent.name);

      if (!dirent.isFile || (path.extname(absolutePath).toLocaleUpperCase("en-us") !== ".JSON")) {
        console.debug(`Skipping non-JSON file: ${absolutePath}`);
        continue;
      }

      console.log(`processing links file: ${absolutePath}`);
      const linksJsonString = await fsAsync.readFile(absolutePath, "utf8");
      const upperlinksJsonString = linksJsonString.toLocaleUpperCase("en-us");

      for (const propName in newInitiativeJson) {
        
        const value = newInitiativeJson[propName];
        if (propName === "initiativeValidationDetails" || typeof value !== "string") {
          continue;
        }
    
        const propValueUpper = value.toLocaleUpperCase("en-us");
        if (upperlinksJsonString.indexOf(propValueUpper) !== -1) {
          await warnAndCommentAsync(
`Initiative might already exist!
The value of property \`${propName}\` (\`${value}\`) is already present in \`${absolutePath}\`:
\`\`\`json
${linksJsonString}
\`\`\`
- **If this is a mistake and it doesn't already exist:** edit the issue's title so that it starts with **\`[FORCE-PR-NEW-INITIATIVE]:\`**
- **If you wish to update an existing initiative:** edit the issue's title so that it starts with **\`[UPDATE-INITIATIVE]:\`**`,
             "Suspected existing initiative",
             newInitiativeJson)
          return true;
        }
      }
    }

    return false;
  }

  function getImageExtension(mimeType) {
    // based on https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    // when MIME detection fails, we return jpeg (as opposed to jpg) to more easily detect these cases
    // browsers should handle such MIME mismatches, but if we see that is not the case and need a better fallback we can:
    // * Use a robust package like https://www.npmjs.com/package/mime-types
    // * Try and extract the extension from the URL

    if (typeof mimeType !== "string") {
      console.warn(`Invalid MIME type detected: ${mimeType}`);
      return "jpeg";
    }

    switch (mimeType.split(";")[0].trim().toLocaleUpperCase("en-us")) {
      case 'IMAGE/WEBP':
        return "webp";
      case 'IMAGE/TIFF':
        return "tif";
      case 'IMAGE/SVG+XML':
        return "svg";
      case 'IMAGE/PNG':
        return "png";
      case 'IMAGE/JPEG':
        return "jpg";
      case 'IMAGE/VND.MICROSOFT.ICON':
        return "ico";
      case 'IMAGE/GIF':
        return "gif";
      case 'IMAGE/BMP':
        return "bmp";
      case 'IMAGE/AVIF':
        return "avif";
      default:
        console.warn(`Unknown MIME type detected (will use jpeg): ${mimeType}`);
        return "jpeg";
    }
  }

  async function retainInitiativeImageAsync(newInitiativeJson) {
    const imageUrl = newInitiativeJson.initiativeImage?.trim();
    if (!imageUrl) {
      console.debug("Initiative image not specified");
      return null;
    }

    let url;
    try {
      url = new URL(imageUrl);
    }
    catch (e) {
      console.debug(`Initiative image could not be parsed as URL: ${imageUrl}`);
      return null;
    }

    let response;
    try {
      console.debug(`Fetching URL: ${url}`);
      response = await fetch(url);
    }
    catch (e) {
      console.warn(`Error fetching: ${e}, ${e.cause}`);
      return null;
    }
  
    if (!response.ok) {
      console.warn(`Non-success HTTP status code: ${response.status} ${response.statusText}`);
      return null;
    }

    const imageExtension = getImageExtension(response.headers.get("Content-Type"));
    const imageNameRelativePath = `/images/${newInitiativeJson.name}-${crypto.randomUUID()}.${imageExtension}`;
    imageAbsolutePath = `${process.env.GITHUB_WORKSPACE}/public${imageNameRelativePath}`;

    const outFileStream = fs.createWriteStream(imageAbsolutePath);
    await streamPromises.finished(stream.Readable.fromWeb(response.body).pipe(outFileStream));

    newInitiativeJson.initiativeImage = imageNameRelativePath;
    return imageAbsolutePath;
  }

  async function getExistingInitiativeIndexAsync(categoryJson, newInitiativeJson) {
    const initiativeName = newInitiativeJson.name;

    if (!(initiativeName?.trim())) {
      await warnAndCommentAsync("For update, you must provide a name that matches the name of an existing initiative", "no initiative name provided", newInitiativeJson);
      return -1;
    }
    
    const existingCategoryIndex = categoryJson.links.findIndex(link => link.name?.localeCompare(initiativeName, undefined, { sensitivity: 'accent' }) === 0)
    if (existingCategoryIndex === -1) {
      await warnAndCommentAsync(`Could not find existing initiative '${initiativeName}' in category '${category}'`, "initiative not found", newInitiativeJson);
      return -1;
    }

    return existingCategoryIndex;
  }

  const tempFolder = process.env.TEMP || "/tmp";
  const gptResponse = await fsAsync.readFile(tempFolder + "/gpt-auto-comment.output", "utf8");

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
  
  let categoryJson, categoryLinksJsonFile;
  try {
    categoryLinksJsonFile = `${process.env.GITHUB_WORKSPACE}/_data/links/${category}/links.json`;
    console.log("resolved category links file: " + categoryLinksJsonFile);

    const categoryJsonString = await fsAsync.readFile(categoryLinksJsonFile, "utf8");
    categoryJson = JSON.parse(categoryJsonString);
  }
  catch (e) {
    return await warnAndCommentAsync("Could not process category links JSON", e, newInitiativeJson);
  }

  const retainedImagePath = await retainInitiativeImageAsync(newInitiativeJson);

  if (updateInitiative) {
    const existingInitiativeIndex = await getExistingInitiativeIndexAsync(categoryJson, newInitiativeJson, newInitiativeJson)
    if (existingInitiativeIndex === -1) {
      return;
    }

    categoryJson.links[existingInitiativeIndex] = newInitiativeJson;
  }
  else {
    categoryJson.links.push(newInitiativeJson);
  }
  
  await fsAsync.writeFile(categoryLinksJsonFile, JSON.stringify(categoryJson, null, 2), "utf8");

  const branch = `auto-pr-${context.issue.number}`;
  try {
    pushPrBranch(branch, categoryLinksJsonFile, retainedImagePath, newInitiativeJson.name);
  }
  catch (e) {
    return await warnAndCommentAsync("encountered error during git execution", e, newInitiativeJson);
  }

  let pr;
  try {
    pr = await createOrUpdatePullRequestAsync(updateInitiative, branch, newInitiativeJson.name || "???");
  }
  catch (e) {
    return await warnAndCommentAsync("Could not create pull request", e, newInitiativeJson);
  }

  console.log("resolved PR: " + JSON.stringify(pr))
  await createCommentAsync((pr.existing ? "Updated" : "Created") + " PR: " + pr.html_url);
}
