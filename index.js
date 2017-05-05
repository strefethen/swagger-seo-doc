#!/usr/bin/env node
var request = require('superagent');
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
const pug = require('pug');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

function findObjectsAndMethods(paths) {
  var objects = {};
  for (var p in paths) {
    var splitpath = p.split('/');
    if (splitpath.length == 2) {
      objects[splitpath[1]] = paths[p];
      continue;
    }
    if (!objects[splitpath[1]]) {
      objects[splitpath[1]] = { methods: [] };
    }
    for (var i = 2; i < splitpath.length; i++) {
      if (!splitpath[i].startsWith('{'))
        if (!objects[splitpath[1]]['methods']) {
          objects[splitpath[1]]['methods'] = { [splitpath[i]]: paths[p] };  
        } else {
          objects[splitpath[1]]['methods'][splitpath[i]] = paths[p];
        }
    }
  }
  return objects;
}

function processSwagger(swagger, outpath) {
  var objectsAndMethods = findObjectsAndMethods(swagger.paths);
  fs.writeFileSync(outpath + '/index.html', pug.renderFile('templates/home.pug', { swagger: swagger, objects: objectsAndMethods }), () => { });
  for (var key of Object.keys(objectsAndMethods)) {
    mkdirp(outpath + path.sep + key);
    fs.writeFileSync(outpath + path.sep + key + path.sep + 'index.html', pug.renderFile('templates/object.pug', { swagger: swagger, object: key, info: objectsAndMethods[key] }), () => {});
    for (var method of Object.keys(objectsAndMethods[key].methods)) {
      fs.writeFileSync(outpath + path.sep + key + path.sep + method + '.html', pug.renderFile('templates/method.pug', { swagger: swagger, parent: key, method: method, info: objectsAndMethods[key].methods[method] }), () => {});
    }
    mkdirp(outpath + path.sep + 'definitions');
    for (var definition in swagger.definitions) {
      fs.writeFileSync(outpath + '/definitions/' + definition + '.html', pug.renderFile('templates/definition.pug', { swagger: swagger, definition: definition, info: swagger.definitions[definition] }), () => { });
    }
  }
}

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
        mkdirp(program.path);
        processSwagger(res.body, program.path);
      })
  })
  .parse(process.argv);
