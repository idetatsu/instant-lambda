var fs = require('fs');

module.exports = run = () => {
	const currentWorkingDir = process.cwd();
	const lambdaConfigJsonPath = `${currentWorkingDir}/lambda-config.json`;
	// read lambda-config.json
	if(!fs.existsSync(lambdaConfigJsonPath)) {
		console.error('Error: Missing lambda-config.json. Aborting.');
		process.exit(1);
	}
	const lambdaConfigJson = JSON.parse(fs.readFileSync(lambdaConfigJsonPath));

	// get the handler method.
	const handlerFile = lambdaConfigJson.handlerFile;
	if(!handlerFile) {
		console.error("Error: Missing handlerFile in lambda-config.json. Aborting.");
		process.exit(1);
	}
	const handlerMethod = lambdaConfigJson.handlerMethod;
	if(!handlerMethod) {
		console.error("Error: Missing handlerMethod in lambda-config.json. Aborting.");
		process.exit(1);
	}
	const handler = require(`${currentWorkingDir}/${handlerFile}`)[handlerMethod];

	// read event.json
	let event = {}
	const eventJsonPath = `${currentWorkingDir}/event.json`;
	if(fs.existsSync(eventJsonPath)) {
		event = JSON.parse(fs.readFileSync(eventJsonPath));
	}

	runHandler(handler, event)
};

runHandler = (handler, event) => {
	let callback = () => {};
	let context = {};
	handler(event, context, callback);
};
