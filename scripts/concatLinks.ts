const fsPromises = require("fs").promises;
const path = require("path");

const excludedDirs = [".next", "node_modules"];
const excludedFiles = [
	"package-lock.json",
	"package.json",
	"tsconfig.json",
	"meta.json",
	".eslintrc.json",
	"newsFeed.json",
];
const outputFilePath = path.join(__dirname, "..", "concatenated_json.txt");

async function concatLinks(dirPath: any) {
	try {
		const dirents = await fsPromises.readdir(dirPath, { withFileTypes: true });
		for (const dirent of dirents) {
			const fullPath = path.join(dirPath, dirent.name);
			if (dirent.isDirectory()) {
				if (!excludedDirs.includes(dirent.name)) {
					await concatLinks(fullPath);
				}
			} else if (
				dirent.isFile() &&
				dirent.name.endsWith(".json") &&
				!excludedFiles.includes(dirent.name)
			) {
				const content = await fsPromises.readFile(fullPath, "utf-8");
				await processFile(content, fullPath);
			}
		}
	} catch (error) {
		console.error(`Error processing directory: ${dirPath}`, error);
	}
}

async function processFile(content: string, fullPath: any) {
	try {
		const jsonData = JSON.parse(content);
		if (jsonData.links && Array.isArray(jsonData.links)) {
			jsonData.links.forEach((link: { description: any }) => {
				delete link.description;
			});
		}
		await fsPromises.appendFile(
			outputFilePath,
			JSON.stringify(jsonData) + "\n",
		);
	} catch (error) {
		console.error(`Error processing file: ${fullPath}`, error);
	}
}

concatLinks(path.join(__dirname, "..")).then(() =>
	console.log("Concatenation complete."),
);
