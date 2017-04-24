var fs = require('fs-extra');
var archiver = require('archiver');

module.exports = pack = () => {
	const currentWorkingDir = process.cwd();
	const packageDir = `${currentWorkingDir}/package`;
	const nodeModulesDir = `${currentWorkingDir}/node_modules/`;
	const packageJsonPath = `${currentWorkingDir}/package.json`; 
	const lambdaConfigPath = `${currentWorkingDir}/lambda-config.json`;
	if(!fs.existsSync(packageJsonPath)) {
		console.error('Error: Missing package.json. Aborting.');
		process.exit(1);
	}
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
	const packageZipPath = `${packageDir}/${packageJson.name}.zip`;

	// read lambda-config.json
	if(!fs.existsSync(lambdaConfigPath)) {
		console.error('Error: Missing lambda-config.json. Aborting.');
		process.exit(1);
	}
	let lambdaConfigJson = JSON.parse(fs.readFileSync(lambdaConfigPath));
	if(!lambdaConfigJson.handlerFile) {
		console.error('Error: Missing handlerFile in lambda-config.json. Aborting.');
		process.exit(1);
	}
	let handlerFile = `${lambdaConfigJson.handlerFile}.js`;
	let handlerFilepath = `${currentWorkingDir}/${handlerFile}`;
	
	// delete old package directory
	if(fs.existsSync(packageDir)) {
		fs.removeSync(packageDir);
	}
	fs.mkdirSync(packageDir);

	// prepare archiver
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

	// archive necessary files
	archive.file(handlerFilepath, { name: handlerFile });
	if (packageJson.dependencies && fs.existsSync(nodeModulesDir)) {
		archive.directory(nodeModulesDir, 'node_modules/');
	}

	archive.finalize();
};