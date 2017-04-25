var fs = require('fs');
var chalk = require('chalk');

module.exports = create = (lambdaName) => {
	console.log(chalk.bold.blue('INFO')+'\tCreating an AWS Lambda function...');

	const currentWorkingDir = process.cwd();

	const lambdaDir = `${currentWorkingDir}/${lambdaName}`;
	if(fs.existsSync(lambdaDir)) {
		console.error(chalk.bold.red('ERROR') + '\tDirectory already exits. Aborting.');
		process.exit(1);
	}
	fs.mkdirSync(lambdaDir);
	
	console.log(chalk.bold.blue('INFO')+'\tCopying template files...');
	const templateDir = `${__dirname}/../template`;

	const appjs = fs.readFileSync(`${templateDir}/app.js`);
	fs.writeFileSync(`${lambdaDir}/app.js`, appjs);

	const lambdaConfig = fs.readFileSync(`${templateDir}/lambda-config.json`);
	let lambdaConfigJson = JSON.parse(lambdaConfig);
	lambdaConfigJson['functionName'] = lambdaName;
	fs.writeFileSync(`${lambdaDir}/lambda-config.json`,
		JSON.stringify(lambdaConfigJson, null, 2));

	const deployConfigJson = fs.readFileSync(`${templateDir}/deploy-config.json`);
	fs.writeFileSync(`${lambdaDir}/deploy-config.json`, deployConfigJson);
	
	const eventJson = fs.readFileSync(`${templateDir}/event.json`);
	fs.writeFileSync(`${lambdaDir}/event.json`, eventJson);

	const packageJson = {
		name: lambdaName,
		version: '0.0.1',
		private: true,
	};
	fs.writeFileSync(`${lambdaDir}/package.json`, JSON.stringify(packageJson, null, 2));
	console.log(chalk.bold.blue('INFO')+'\tYour Lambda has been created at '+chalk.bold(lambdaName)+'!');
};