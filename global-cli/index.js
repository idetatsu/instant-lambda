#!/usr/bin/env node
'use strict'

var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2));

var create = require('../bin/create');
var run = require('../bin/run');
var pack = require('../bin/pack');
var deploy = require('../bin/deploy');

if (argv.length === 0) {
	console.error(
		'Usage: instalam create <function-name>'
	);
	process.exit(1);
}

if(argv.version || argv.v) {
	console.log('instant-lambda version: ' + require('../package.json').version);
	process.exit();
}

var commands = argv._;
switch(commands[0]) {
	case 'create':
	case 'c': {
		if(!commands[1]){
			console.error(
				'Error: Missing function name. \n' +
				'Usage: instalam create <function-name>'
			);
			process.exit(1);
		}

		create(commands[1]);
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
		deploy();
		break;
	}
	default: {
		console.error(
			'Usage: instalam create <project-name>'
		);
		process.exit(1);
	}
}
