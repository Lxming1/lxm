#!/usr/bin/env node
// npm install commander
const program = require('commander')
const createCommands = require('./lib/core/create')
const helpOptions = require('./lib/core/help')

program.version(require('./package.json').version)

// my options
helpOptions()

// my commands
createCommands()

program.parse(process.argv)
