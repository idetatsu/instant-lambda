var chalk = require('chalk');

exports.putError = (errorText) => {
	console.error(chalk.bold.red('ERROR') + `\t${errorText}`);
}

exports.putInfo = (infoText) => {
	console.log(chalk.bold.blue('INFO') + `\t${infoText}`);
}