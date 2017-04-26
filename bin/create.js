const fs = require('fs');
const chalk = require('chalk');
const instalamUtil = require('./instant-lambda-util');

module.exports = create;
function create(lambdaName) {
	if(!isLambdaNameValid(lambdaName)) {
		instalamUtil.putError('Invalid Lambda name. Aborting.');
		process.exit(1);
	}

	instalamUtil.putInfo('Creating an AWS Lambda function...');

	const lambdaDir = `${process.cwd()}/${lambdaName}`;
	if(fs.existsSync(lambdaDir)) {
		instalamUtil.putError('Directory already exists. Aborting.');
		process.exit(1);
	}
	fs.mkdirSync(lambdaDir);

	instalamUtil.putInfo('Copying template files...');

	copyFromTemplateDirToLambdaDir('app.js', lambdaName);
	copyFromTemplateDirToLambdaDir('deploy-config.json', lambdaName);
	copyFromTemplateDirToLambdaDir('event.json', lambdaName);
	createLambdaConfig(lambdaName);
	createPackageJson(lambdaName);

	instalamUtil.putInfo('Your Lambda has been created at '+chalk.bold(lambdaName)+'!');
}

function copyFromTemplateDirToLambdaDir(filename, lambdaName) {
	const templateDir = `${__dirname}/../template`;
	const lambdaDir = `${process.cwd()}/${lambdaName}`;

	const file = fs.readFileSync(`${templateDir}/${filename}`);
	fs.writeFileSync(`${lambdaDir}/${filename}`, file);
}

function createLambdaConfig(lambdaName) {
	const templateDir = `${__dirname}/../template`;
	const lambdaDir = `${process.cwd()}/${lambdaName}`;

	let lambdaConfig = JSON.parse(fs.readFileSync(`${templateDir}/lambda-config.json`));
	lambdaConfig['functionName'] = lambdaName;
	fs.writeFileSync(`${lambdaDir}/lambda-config.json`, JSON.stringify(lambdaConfig, null, 2));
}

function createPackageJson(lambdaName) {
	const lambdaDir = `${process.cwd()}/${lambdaName}`;
	const packageJson = {
		name: lambdaName,
		version: '0.0.1',
		private: true,
	};
	fs.writeFileSync(`${lambdaDir}/package.json`, JSON.stringify(packageJson, null, 2));
}

function isLambdaNameValid(lambdaName) {
	return true;
}
