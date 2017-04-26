var aws = require('aws-sdk');
var chalk = require('chalk');
var instalamUtil = require('./instant-lambda-util');
var fs = require('fs');

module.exports = deploy = (options) => {
	const currentWorkingDir = process.cwd();
	const packageJsonPath = `${currentWorkingDir}/package.json`;

	if(!fs.existsSync(packageJsonPath)) {
		instalamUtil.putError('Missing package.json. Aborting.');
		process.exit(1);
	}
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
	
	const lambdaConfigJsonPath = `${currentWorkingDir}/lambda-config.json`;
	if(!fs.existsSync(lambdaConfigJsonPath)) {
		instalamUtil.putError('Missing lambda-config.json. Aborting.');
		process.exit(1);
	}
	const lambdaConfigJson = JSON.parse(fs.readFileSync(lambdaConfigJsonPath));

	const deployConfigJsonPath = `${currentWorkingDir}/deploy-config.json`;
	if(!fs.existsSync(deployConfigJsonPath)) {
		instalamUtil.putError('Missing deploy-config.json. Aborting.');
		process.exit(1);
	}
	const deployConfigJson = JSON.parse(fs.readFileSync(deployConfigJsonPath));
	
	const packagePath = `${currentWorkingDir}/package/${packageJson.name}.zip`;
	if(!fs.existsSync(packagePath)) {
		instalamUtil.putError(
			'Could not locate the package. \n' +
			'\tPlease run ' +
			chalk.bold.yellow('instant-lambda pack')+
			' to create a package to deploy.'
		);
		process.exit(1);
	}
	const packageZip = fs.readFileSync(packagePath);

	let Lambda = new aws.Lambda({region: deployConfigJson.region});
	lambdaExists(lambdaConfigJson.functionName, deployConfigJson.region).then( () => {
		// update
		const isOptionEmpty = !options.code && !options.config;
		if(options.code || isOptionEmpty) {
			let params = getParamsToUpdateCode(lambdaConfigJson, packageZip);
			Lambda.updateFunctionCode(params, displayResult);	
		}
		if(options.config || isOptionEmpty) {
			let params = getParamsToUpdateConfig(lambdaConfigJson);
			Lambda.updateFunctionConfiguration(params, displayResult);
		}
	}).catch( () => {
		// create
		let params = getParamsToCreateFunction(lambdaConfigJson, packageZip);
		Lambda.createFunction(params, displayResult);
	});
};

getParamsToUpdateCode = (lambdaConfig, zipFile) => {
	return {
		ZipFile: zipFile,
		FunctionName: lambdaConfig.functionName,
	}
}

getParamsToUpdateConfig = (lambdaConfig) => {
	return {
		FunctionName: lambdaConfig.functionName,
		Runtime: lambdaConfig.runtime,
		Handler: `${lambdaConfig.handlerFile}.${lambdaConfig.handlerMethod}`,
		Role: lambdaConfig.role,
		Description: lambdaConfig.description,
		MemorySize: lambdaConfig.memorySize,
		Timeout: lambdaConfig.timeout,
		Environment: lambdaConfig.environment,
	}
}

getParamsToCreateFunction = (lambdaConfig, zipFile) => {
	let params = getParamsToUpdateConfig(lambdaConfig);
	params['Code'] = {
		ZipFile: zipFile
	};
	return params;
}

displayResult = (err, data) => {
	if (err) {
		if(err.code == 'CredentialsError'){
			instalamUtil.putError(err.message);
		}else if(err.code == 'ValidationException'){
			instalamUtil.putError(err.message);
		}else{
			console.log(err);
		}
	}else {
    	console.log(data);
	}
}

lambdaExists = (functionName, region) => {
  	return new Promise((resolve, reject) => {
		let Lambda = new aws.Lambda({region: region});
    	let getFunction = Lambda.getFunction({ FunctionName: functionName }).promise();
    	getFunction.then(
    		resolve
    	).catch(
    		reject
    	);
  	});
};