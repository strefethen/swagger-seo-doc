#!/usr/bin/env node
var request = require('superagent');
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');

program
  .version('0.0.1')
  .arguments('<swagger_url>')
  .option('-p, --path <path>', 'Output path')
  .action(function(swagger_url) {
    console.log(program.path);
    console.log(swagger_url);
    request
      .get(swagger_url)
      .end(function (err, res) {
        console.log(res.body);
      })
  })
  .parse(process.argv);