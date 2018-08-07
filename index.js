#!/usr/bin/env node

var request = require('superagent');
var program = require('commander');
const pug = require('pug');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

function findObjectsAndMethods(paths) {
  var objects = {};
  Object.keys(paths).forEach((p) => {
    var splitpath = p.split('/');
    if (splitpath.length == 2) {
      objects[splitpath[1]] = paths[p];
    }
    if (!objects[splitpath[1]]) {
      objects[splitpath[1]] = {
        methods: []
      };
    }
    for (var i = 2; i < splitpath.length; i++) {
      objects[splitpath[1]]['methods'][paths[p].get.operationId] = paths[p];
    }
  });
  return objects;
}

function processSwagger(swagger, outPath, tempPath) {
  var objectsAndMethods = findObjectsAndMethods(swagger.paths);
  fs.writeFileSync(outPath + '/index.html', pug.renderFile(tempPath + '/home.pug', {
    swagger: swagger,
    objects: objectsAndMethods
  }), () => {});
  for (var key of Object.keys(objectsAndMethods)) {
    mkdirp(outPath + path.sep + key);
    fs.writeFileSync(outPath + path.sep + key + path.sep + 'index.html', pug.renderFile(tempPath + '/object.pug', {
      swagger: swagger,
      object: key,
      info: objectsAndMethods[key]
    }), () => {});
    for (var method of Object.keys(objectsAndMethods[key].methods)) {
      fs.writeFileSync(outPath + path.sep + key + path.sep + method + '.html', pug.renderFile(tempPath + '/method.pug', {
        swagger: swagger,
        parent: key,
        method: method,
        info: objectsAndMethods[key].methods[method]
      }), () => {});
    }
    mkdirp(outPath + path.sep + 'definitions');
    for (var definition in swagger.definitions) {
      fs.writeFileSync(outPath + '/definitions/' + definition + '.html', pug.renderFile(tempPath + '/definition.pug', {
        swagger: swagger,
        definition: definition,
        info: swagger.definitions[definition]
      }), () => {});
    }
  }
}

program
  .version('0.0.1')
  .arguments('<swagger_url> <output_path> <template_path>')
  .action(function (swagger_url, output_path, template_path) {
    console.log('URL: ', swagger_url);
    console.log('Path: ', template_path);
    if (swagger_url.startsWith('http')) {
      request
        .get(swagger_url)
        .end(function (err, res) {
          mkdirp(output_path);
          processSwagger(res.body, output_path, template_path);
        });
    } else {
      fs.readFile(swagger_url, function (err, data) {
        if (err) {
          throw err;
        }
        mkdirp(output_path);
        processSwagger(data.toJSON(), output_path, template_path);
      });
    }
  })
  .parse(process.argv);
