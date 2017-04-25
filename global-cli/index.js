#!/usr/bin/env node
'use strict'

var fs = require('fs');
var chalk = require('chalk');
var figlet = require('figlet');
const argv = require('minimist')(process.argv.slice(2));

var create = require('../bin/create');
var run = require('../bin/run');
var pack = require('../bin/pack');
var deploy = require('../bin/deploy');

var helptext = chalk.cyan('Usage')+' instalam [--version] [--help]\n' +
    			'\tcreate <function-name> \n' +
    			'\trun \n' +
    			'\tpack \n' +
    			'\tdeploy [--code] [--config]\n';

if (argv.length === 0) {
	console.error(helptext);
	process.exit(1);
}

if(argv.version || argv.v) {
	console.log('instant-lambda version: ' + require('../package.json').version);
	process.exit();
}

switch(argv._[0]) {
	case 'create':
	case 'c': {
		if(!argv._[1]){
			console.error(chalk.bold.red('ERROR') + '\tMissing function name.\n' + helptext);
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
		}
		deploy(options);
		break;
	}
	default: {
		console.error(
			chalk.yellow(figlet.textSync('instant-lambda')) + '\n' +
			helptext
		);
		process.exit(1);
	}
}
