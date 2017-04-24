#!/usr/bin/env node
'use strict'

var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2));

var create = require('../bin/create');
var run = require('../bin/run');
var pack = require('../bin/pack');
var deploy = require('../bin/deploy');

var commands = argv._;
if (commands.length === 0) {
	console.error(
		'Usage: instalam create <function-name>'
	);
	process.exit(1);
}

if(commands.version) {
	console.log('instant-lambda version: ' + require('./package.json').version);
	process.exit();
}

switch(commands[0]) {
	case 'create': {
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
	case 'run': {
		run();
		break;
	}
	case 'pack': {
		pack();
		break;
	}
	case 'deploy': {
		deploy();
		break;
	}
	default: {
		console.error(
			'Usage: instalam create <project-name>'
		);
	}
}
