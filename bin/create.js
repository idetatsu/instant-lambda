var fs = require('fs');

module.exports = create = (lambdaName) => {
	console.log('Creating an AWS Lambda function...');

	let currentWorkingDir = process.cwd();
	let lambdaDir = `${currentWorkingDir}/${lambdaName}`;

	if(fs.existsSync(lambdaDir)) {
		console.error('Error: Lambda already exits. Aborting.');
		process.exit(1);
	}
	fs.mkdirSync(lambdaDir);
	
	let templateDir = `${__dirname}/../template`;

	let appjs = fs.readFileSync(`${templateDir}/app.js`);
	fs.writeFileSync(`${lambdaDir}/app.js`, appjs);
	let lambdaConfigJson = fs.readFileSync(`${templateDir}/lambda-config.json`);
	fs.writeFileSync(`${lambdaDir}/lambda-config.json`, lambdaConfigJson);
	let eventJson = fs.readFileSync(`${templateDir}/event.json`);
	fs.writeFileSync(`${lambdaDir}/event.js`, eventJson);

	let packageJson = {
		name: lambdaName,
		version: '0.0.1',
		private: true,
	};
	fs.writeFileSync(`${lambdaDir}/package.json`, JSON.stringify(packageJson, null, 2));
};