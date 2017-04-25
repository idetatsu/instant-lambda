var fs = require('fs-extra');
var archiver = require('archiver');

module.exports = pack = () => {
	const currentWorkingDir = process.cwd();
	
	const packageDir = `${currentWorkingDir}/package`;
	if(fs.existsSync(packageDir)) {
		fs.removeSync(packageDir);
	}
	fs.mkdirSync(packageDir);

	const packageJsonPath = `${currentWorkingDir}/package.json`; 
	if(!fs.existsSync(packageJsonPath)) {
		console.error('Error: Missing package.json. Aborting.');
		process.exit(1);
	}
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

	const lambdaConfigPath = `${currentWorkingDir}/lambda-config.json`;
	if(!fs.existsSync(lambdaConfigPath)) {
		console.error('Error: Missing lambda-config.json. Aborting.');
		process.exit(1);
	}
	const lambdaConfigJson = JSON.parse(fs.readFileSync(lambdaConfigPath));
	
	const handlerFile = `${lambdaConfigJson.handlerFile}.js`;
	if(!lambdaConfigJson.handlerFile) {
		console.error('Error: Missing handlerFile in lambda-config.json. Aborting.');
		process.exit(1);
	}
	
	// prepare archiver
	const packageZipPath = `${packageDir}/${lambdaConfigJson.functionName}.zip`;
	let output = fs.createWriteStream(packageZipPath);
	let archive = archiver('zip');
	archive.on('error', (err) => {
		console.error(err);
		process.exit(1);
	});
	output.on('close', () => {
		console.log(`INFO: ${archive.pointer()} bytes.`);
	});
	archive.pipe(output);

	const handlerFilepath = `${currentWorkingDir}/${handlerFile}`;
	archive.file(handlerFilepath, { name: handlerFile });

	const nodeModulesDir = `${currentWorkingDir}/node_modules/`;
	if (packageJson.dependencies && fs.existsSync(nodeModulesDir)) {
		archive.directory(nodeModulesDir, 'node_modules/');
	}

	archive.finalize();
};