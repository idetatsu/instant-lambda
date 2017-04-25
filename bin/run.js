var fs = require('fs');
var instalamUtil = require('./instant-lambda-util');

module.exports = run = () => {
	const currentWorkingDir = process.cwd();
	const lambdaConfigJsonPath = `${currentWorkingDir}/lambda-config.json`;
	// read lambda-config.json
	if(!fs.existsSync(lambdaConfigJsonPath)) {
		instalamUtil.putError('Missing lambda-config.json. Aborting.');
		process.exit(1);
	}
	const lambdaConfigJson = JSON.parse(fs.readFileSync(lambdaConfigJsonPath));

	// get the handler method.
	const handlerFile = lambdaConfigJson.handlerFile;
	if(!handlerFile) {
		instalamUtil.putError('Missing handlerFile in lambda-config.json. Aborting.');
		process.exit(1);
	}
	const handlerMethod = lambdaConfigJson.handlerMethod;
	if(!handlerMethod) {
		instalamUtil.putError('Missing handlerMethod in lambda-config.json. Aborting.');
		process.exit(1);
	}
	const handler = getHandler(currentWorkingDir, handlerFile, handlerMethod);

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

getHandler = (workingDir, handlerFile, handlerMethod) => {
	return require(`${workingDir}/${handlerFile}`)[handlerMethod];
}