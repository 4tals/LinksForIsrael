import axios from 'axios';
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
    response = await axios.get(url);
  }
  catch (e) {
    console.warn(`Error fetching url: ${url}\n${e}`);
    unavailableUrls.push(url);
    return;
  }

  console.log(`URL is available: ${url} ${response.status} ${response.statusText}`);
}

console.log("Checking availability of initative links");
let processedUrls = new Set();
let unavailableUrls = [];

const linksFolder = `${process.env.GITHUB_WORKSPACE}/_data/links`;
const dirents = await fs.readdir(linksFolder, { withFileTypes: true, recursive: true });
let index = 0;
for (const dirent of dirents) {
  const absolutePath = resolve(dirent.path, dirent.name);

  if (!dirent.isFile || (extname(absolutePath).toLocaleUpperCase("en-us") !== ".JSON")) {
    console.debug(`Skipping non-JSON file: ${absolutePath}`);
    continue;
  }

  console.log(`processing links file #${++index}/${dirents.length}: ${absolutePath}`);

  const linksJsonString = await fs.readFile(absolutePath, "utf8");
  const linksJson = JSON.parse(linksJsonString);

  if (!linksJson.links) {
    console.info("No links property foind, skipping JSON (assuming category descriptor)")
    continue;
  }

  const fetchPromises = [];
  for (const link of linksJson.links) {
    console.log(`processing initative: ${link.name}`);

    for (const prop in link) {
      const val = link[prop]

      console.log(`Processing property ${prop} with value ${val}`)

      if (typeof val !== "string") {
        console.debug(`Skipping non-string property`)
        continue;
      }

      if (!val.toLocaleUpperCase("en-us").startsWith("HTTP")) {
        console.debug(`Only http/https URLs are supported`);
        continue;
      }

      const url = val.trim();
      if (url.match(/\s/g)) {
        console.debug(`Whitespace detected, assuming description containing more than just a URL`);
        continue;
      }

      if (processedUrls.has(url)) {
        console.debug(`Already processed URL: ${url}`);
        continue;
      }

      processedUrls.add(url);
      try {
        new URL(url);
      }
      catch {
        console.debug(`Value of property ${prop} could not be parsed as a URL: ${url}`);
        continue;
      }

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
  octokit.rest.issues.create({
    owner: owner,
    repo: repo,
    title: `[AVAILABILITY-MONITOR] ${unavailableUrls.length} Unavailable URL(s) Detected`,
    body: body
  });
}
else {
  console.log("No unavailable URLs detected");
}