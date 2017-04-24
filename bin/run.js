var fs = require('fs');
var child_process = require('child_process');

module.exports = run = () => {
	let currentWorkingDir = process.cwd();

	// read lambda-config.json
	if(!fs.existsSync(`${currentWorkingDir}/lambda-config.json`)) {
		console.error('Error: Missing lambda-config.json. Aborting.');
		process.exit(1);
	}
	let lambdaConfigJson = JSON.parse(fs.readFileSync(`${currentWorkingDir}/lambda-config.json`));

	// get the handler method.
	let handlerFile = lambdaConfigJson.handlerFile ;
	let handlerMethod = lambdaConfigJson.handlerMethod || 'main';
	let handler = require(`${currentWorkingDir}/${handlerFile}`)[handlerMethod];

	// read event.json
	let event = {}
	if(fs.existsSync(`${currentWorkingDir}/event.json`)) {
		event = JSON.parse(fs.readFileSync(`${currentWorkingDir}/event.json`));
	}

	runHandler(handler, event)
};

runHandler = (handler, event) => {
	let callback = () => {};
	let context = {};
	handler(event, context, callback);
};
