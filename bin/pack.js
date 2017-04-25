var fs = require('fs-extra');
var chalk = require('chalk');
var archiver = require('archiver');

module.exports = pack = () => {
	console.log(chalk.bold.blue('INFO')+'\tPackaging your Lambda...');
	const currentWorkingDir = process.cwd();
	
	const packageDir = `${currentWorkingDir}/package`;
	if(fs.existsSync(packageDir)) {
		console.log(chalk.bold.blue('INFO')+'\tRemoving old package...');
		fs.removeSync(packageDir);
	}
	fs.mkdirSync(packageDir);

	const packageJsonPath = `${currentWorkingDir}/package.json`; 
	if(!fs.existsSync(packageJsonPath)) {
		console.error(chalk.bold.red('ERROR')+':\tMissing package.json. Aborting.');
		process.exit(1);
	}
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

	const lambdaConfigPath = `${currentWorkingDir}/lambda-config.json`;
	if(!fs.existsSync(lambdaConfigPath)) {
		console.error(chalk.bold.red('ERROR')+':\tMissing lambda-config.json. Aborting.');
		process.exit(1);
	}
	const lambdaConfigJson = JSON.parse(fs.readFileSync(lambdaConfigPath));
	
	const handlerFile = `${lambdaConfigJson.handlerFile}.js`;
	if(!lambdaConfigJson.handlerFile) {
		console.error(chalk.bold.red('ERROR')+':\tMissing handlerFile in lambda-config.json. Aborting.');
		process.exit(1);
	}
	
	// prepare archiver
	console.log(chalk.bold.blue('INFO')+'\tArchiving necessary files...');
	const packageZipPath = `${packageDir}/${lambdaConfigJson.functionName}.zip`;
	let output = fs.createWriteStream(packageZipPath);
	let archive = archiver('zip');
	archive.on('error', (err) => {
		console.error(err);
		process.exit(1);
	});
	output.on('close', () => {
		console.log(chalk.bold.blue('INFO')+`\tTotal ${archive.pointer()} bytes.`);
		console.log(chalk.bold.blue('INFO')+
			'\tPackaging done. Run '+chalk.bold.yellow('instalam deploy')+' to upload your Lambda!')
	});
	archive.pipe(output);

	const handlerFilepath = `${currentWorkingDir}/${handlerFile}`;
	archive.file(handlerFilepath, { name: handlerFile });

	console.log(chalk.bold.blue('INFO')+'\tAdding dependencies...');
	const nodeModulesDir = `${currentWorkingDir}/node_modules/`;
	if (packageJson.dependencies && fs.existsSync(nodeModulesDir)) {
		archive.directory(nodeModulesDir, 'node_modules/');
	}

	archive.finalize();
};