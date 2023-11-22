import { resolve, extname } from "path";

import { promises as fs } from "fs";
import { Octokit } from "@octokit/rest";
import { createActionAuth } from "@octokit/auth-action";

const auth = createActionAuth();
const authentication = await auth();

const octokit = new Octokit({
  auth: authentication.token
});

async function checkUrlAvailabilityAsync(url, unavailableUrls) {
  let response;
  try {
    console.log(`Fetching URL: ${url}`);
    response = await fetch(url);
  }
  catch (e) {
    console.warn(`Error fetching url: ${url}\n${e}`);
    unavailableUrls.push(url);
    return;
  }

  if (!response.ok) {
    console.warn(`Non-success HTTP status code fetching url: ${url} (${response.status} ${response.statusText})`);
    unavailableUrls.push(url);
    return;
  }

  console.log(`URL is available: ${url} (${response.status} ${response.statusText})`);
}

console.log("Checking availability of initative links");
let processedUrls = new Set();
let unavailableUrls = [];

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

  const fetchPromises = [];
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

      fetchPromises.push(checkUrlAvailabilityAsync(url, unavailableUrls));
    }
  }

  console.log("Fetching file urls...");
  await Promise.all(fetchPromises);
}

if (unavailableUrls.length > 0) {
  console.warn(`Detected unavailable URL(s): ${unavailableUrls}`);

  let body = "";
  for (const url of unavailableUrls) {
    body += `* ${url}\n`
  }

  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  
  octokit.rest.issues.update({
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