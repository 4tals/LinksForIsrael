import { resolve, extname } from "path";
import { promises as fs } from "fs";

import pLimit from 'p-limit';

import fetchWithRetry from 'fetch-retry';
const fetch = fetchWithRetry(global.fetch);

import { Octokit } from "@octokit/rest";
import { createActionAuth } from "@octokit/auth-action";

const auth = createActionAuth();
const authentication = await auth();

const octokit = new Octokit({
  auth: authentication.token
});

const unavailableUrls = [];
const expectedHostErrors = {
  "ironpro.zigit.co.il": "UNABLE TO VERIFY THE FIRST CERTIFICATE",
  "files.oaiusercontent.com": "TOO MANY REQUESTS",
  "chat.openai.com" : "TOO MANY REQUESTS",
  "govextra.gov.il": "FORBIDDEN",
  "app.oct7.io": "FORBIDDEN",
  "needarim.org.il": "FORBIDDEN",
  "shalhevet.co": "FORBIDDEN",
  "special.now14.co.il": "FORBIDDEN",
  "www.geektime.co.il": "FORBIDDEN",
  "giveisrael.org": "FORBIDDEN",
  "www.payboxapp.com": "FORBIDDEN"
}

function addUnavailableUrl(file, name, prop, url, errorMessage) {
  console.warn(`${errorMessage} [${url}]`);

  const expectedHostError = expectedHostErrors[url.hostname];
  if (expectedHostError && errorMessage.toLocaleUpperCase("en-us").indexOf(expectedHostError) !== -1) {
    console.info(`Expected error for host: ${url.hostname} [${expectedHostError}]`);
    return;
  }

  unavailableUrls.push({
    file: file,
    name: name,
    prop: prop,
    url: url,
    err: errorMessage
  });
}

async function checkUrlAvailabilityAsync(file, name, prop, url) {
  let response;
  try {
    console.debug(`Fetching URL: ${url}`);
    response = await fetch(url, {
      retryOn: [400, 429, 500, 502, 503, 504],
      retries: 3,
      retryDelay: function(attempt, error, response) {
        const delayMs = Math.pow(2, attempt) * 1000;
        const errorMessage = error ? `${error}, ${error.cause}` : `${response.status} ${response.statusText}`;
        console.warn(`Error fetching URL '${url}' [attempt #${attempt}]: ${errorMessage} ... will retry in ${delayMs}ms`);
        return delayMs;
      }
    });
  }
  catch (e) {
    addUnavailableUrl(file, name, prop, url, `Error fetching: ${e}, ${e.cause}`);
    return;
  }

  if (!response.ok) {
    addUnavailableUrl(file, name, prop, url, `Non-success HTTP status code: ${response.status} ${response.statusText}`);
    return;
  }

  console.log(`URL is available: ${url} (${response.status} ${response.statusText})`);
}

console.log("Checking availability of initative links");
const processedUrls = new Set();
const fetchPromises = [];
const concurrencyLimit = pLimit(process.env.MAX_CONCURRENCY_LEVEL ? 100 : parseInt(process.env.MAX_CONCURRENCY_LEVEL));

const linksFolder = `${process.env.GITHUB_WORKSPACE}/_data/links`;
const dirents = await fs.readdir(linksFolder, { withFileTypes: true, recursive: true });
let index = 0;
for (const dirent of dirents) {
  const absolutePath = resolve(dirent.path, dirent.name);
  console.log(`processing file #${++index}/${dirents.length}: ${absolutePath}`);

  if (!dirent.isFile || (extname(absolutePath).toLocaleUpperCase("en-us") !== ".JSON")) {
    console.debug(`Skipping non-JSON file: ${absolutePath}`);
    continue;
  }

  const linksJsonString = await fs.readFile(absolutePath, "utf8");
  const linksJson = JSON.parse(linksJsonString);

  if (!linksJson.links) {
    console.info("No links property found, skipping JSON (assuming category descriptor)")
    continue;
  }

  for (const link of linksJson.links) {
    console.log(`processing initative: ${link.name}`);

    for (const prop in link) {
      const val = link[prop]

      console.debug(`Processing property ${prop} with value ${val}`)

      if (typeof val !== "string") {
        console.debug(`Skipping non-string property`)
        continue;
      }

      if (!val.toLocaleUpperCase("en-us").startsWith("HTTP")) {
        console.debug(`Only http[s] URLs are supported`);
        continue;
      }

      const trimmedVal = val.trim();
      if (trimmedVal.match(/\s/g)) {
        console.debug(`Whitespace detected, assuming description containing more than just a URL`);
        continue;
      }

      let url;
      try {
        url = new URL(trimmedVal);
      }
      catch (e) {
        console.debug(`Value of property ${prop} could not be parsed as a URL: ${trimmedVal}\n${e}`);
        continue;
      }

      if (processedUrls.has(url.href)) {
        console.debug(`Already processed URL: ${url}`);
        continue;
      }

      processedUrls.add(url.href);

      fetchPromises.push(concurrencyLimit(checkUrlAvailabilityAsync, absolutePath, link.name, prop, url));
    }
  }
}

console.log("Waiting for URLs to be fetched...");
await Promise.all(fetchPromises);

if (unavailableUrls.length > 0) {
  console.warn(`Detected unavailable URL(s): ${unavailableUrls.map(ui => JSON.stringify(ui))}`);

  let index = 1;
  let body = "";
  for (const urlInfo of unavailableUrls) {
    body += `## URL ${index++}
* File: ${urlInfo.file}
* Name: ${urlInfo.name}
* Property: ${urlInfo.prop}
* URL: ${urlInfo.url}
* Error: ${urlInfo.err}
`
  }

  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  
  await octokit.rest.issues.update({
    issue_number: process.env.GITHUB_AVAILABILITY_ISSUE_NUMBER,
    owner: owner,
    repo: repo,
    title: `[AVAILABILITY-MONITOR] ${unavailableUrls.length} Unavailable URL(s) Detected`,
    body: body
  });
}
else {
  console.log("No unavailable URLs detected");
}

// For some reason handles are still open here (as shown by why-is-node-running), keeping NodeJS running needlessly for many minutes
process.exit();