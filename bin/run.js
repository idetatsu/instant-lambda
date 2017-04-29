const fs = require('fs');
const instalamUtil = require('./instant-lambda-util');

module.exports = run;
function run() {
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
	let event = {};
	const eventJsonPath = `${currentWorkingDir}/event.json`;
	if(fs.existsSync(eventJsonPath)) {
		event = JSON.parse(fs.readFileSync(eventJsonPath));
	}

	const timeout = lambdaConfigJson.timeout;
	runHandler(handler, event, timeout);
}

function runHandler(handler, event, timeout) {
	const startTime = new Date();
	const timeoutInMillis = Math.min(timeout, 300) * 1000;

	const callback = (err, result) => {
		if(err) {
			console.log('Error: ' + err);
			process.exit(1);
		}else {
			console.log('Success: ');
			if(result) {
				console.log(JSON.stringify(result));
			}
			process.exit(0);
		}
	}
	const context = {
		getRemainingTimeInMillis: () => {
			let currentTime = new Date();
			return timeoutInMillis - (currentTime - startTime);
		},
	};
	handler(event, context, callback);
}

function getHandler(workingDir, handlerFile, handlerMethod) {
	return require(`${workingDir}/${handlerFile}`)[handlerMethod];
}
