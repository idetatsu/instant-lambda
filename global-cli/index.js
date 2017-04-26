#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const figlet = require('figlet');
const argv = require('minimist')(process.argv.slice(2));

const instalamUtil = require('../bin/instant-lambda-util');
const create = require('../bin/create');
const run = require('../bin/run');
const pack = require('../bin/pack');
const deploy = require('../bin/deploy');

const helptext = chalk.cyan('Usage')+' instalam [--version] [--help]\n' +
				'\tcreate <function-name> \n' +
				'\trun \n' +
				'\tpack \n' +
				'\tdeploy [--code] [--config]\n';

if (argv.length === 0) {
	console.log(helptext);
	process.exit(1);
}

if(argv.version || argv.v) {
	instalamUtil.putInfo('instant-lambda version: ' + require('../package.json').version);
	process.exit(1);
}

switch(argv._[0]) {
case 'create':
case 'c': {
	if(!argv._[1]) {
		instalamUtil.putError('Missing function name.\n' + helptext);
		process.exit(1);
	}
	create(argv._[1]);
	break;
}
case 'run':
case 'r': {
	run();
	break;
}
case 'pack':
case 'p': {
	pack();
	break;
}
case 'deploy':
case 'd': {
	const options = {
		code: argv.code,
		config: argv.config,
	};
	deploy(options);
	break;
}
default: {
	console.log(
		chalk.yellow(figlet.textSync('instant-lambda')) + '\n' +
		helptext
	);
	process.exit(1);
}
}
