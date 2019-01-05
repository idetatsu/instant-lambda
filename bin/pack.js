const fs = require("fs-extra");
const chalk = require("chalk");
const instalamUtil = require("./instant-lambda-util");
const archiver = require("archiver");

module.exports = pack;
function pack() {
	instalamUtil.putInfo("Packaging your Lambda...");
	const currentWorkingDir = process.cwd();

	const packageDir = `${currentWorkingDir}/package`;
	if(fs.existsSync(packageDir)) {
		instalamUtil.putInfo("Removing old package...");
		fs.removeSync(packageDir);
	}
	fs.mkdirSync(packageDir);

	const packageJsonPath = `${currentWorkingDir}/package.json`;
	if(!fs.existsSync(packageJsonPath)) {
		instalamUtil.putError("Missing package.json. Aborting.");
		process.exit(1);
	}
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

	const lambdaConfigPath = `${currentWorkingDir}/lambda-config.json`;
	if(!fs.existsSync(lambdaConfigPath)) {
		instalamUtil.putError("Missing lambda-config.json. Aborting.");
		process.exit(1);
	}
	const lambdaConfigJson = JSON.parse(fs.readFileSync(lambdaConfigPath));

	const handlerFile = `${lambdaConfigJson.handlerFile}.js`;
	if(!lambdaConfigJson.handlerFile) {
		instalamUtil.putError("Missing handlerFile in lambda-config.json. Aborting.");
		process.exit(1);
	}

	// prepare archiver
	instalamUtil.putInfo("Archiving necessary files...");
	const packageZipPath = `${packageDir}/${lambdaConfigJson.functionName}.zip`;
	const output = fs.createWriteStream(packageZipPath);
	const archive = archiver("zip");
	archive.on("error", (err) => {
		instalamUtil.putError(err);
		process.exit(1);
	});
	output.on("close", () => {
		instalamUtil.putInfo(`Total ${archive.pointer()} bytes.`);
		instalamUtil.putInfo(
			"Packaging done. Run "+chalk.bold.yellow("instalam deploy")+" to upload your Lambda!");
	});
	archive.pipe(output);

	const handlerFilepath = `${currentWorkingDir}/${handlerFile}`;
	archive.file(handlerFilepath, { name: handlerFile, });

	instalamUtil.putInfo("Adding dependencies...");
	const nodeModulesDir = `${currentWorkingDir}/node_modules/`;
	if (packageJson.dependencies && fs.existsSync(nodeModulesDir)) {
		archive.directory(nodeModulesDir, "node_modules/");
	}

	archive.finalize();
}
