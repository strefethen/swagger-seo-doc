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
    var splitpath = p.split(path.sep);
    if (splitpath.length == 2) {
      objects[splitpath[1]] = paths[p];
      continue;
    }
    if (!objects[splitpath[1]]) {
      objects[splitpath[1]] = { methods: [] };
    }
    for (var i = 2; i < splitpath.length; i++) {
      if (!splitpath[i].startsWith('{'))      
        objects[splitpath[1]][splitpath[i]] = paths[p];
    }
  }
  return objects;
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
        console.log(JSON.stringify(findObjectsAndMethods(res.body.paths)));
        fs.writeFile(program.path + '/index.html', pug.renderFile('templates/home.pug', res.body), () => { });
        var seen = {}
        for (var p in res.body.paths) {
          var splitpath = p.split(path.sep);
          var root = splitpath[1];
          if (seen[root]) {
            if (splitpath[2].startsWith('{'))
              continue;
            console.log(program.path + path.sep + root + path.sep + splitpath[2] + '.html');
            fs.writeFile(program.path + path.sep + root + path.sep + splitpath[2] + '.html', pug.renderFile('templates/method.pug', { method: splitpath[2], info: res.body.paths[p] }), () => {});
            continue;
          } else {
            seen[root] = true;
            mkdirp(program.path + path.sep + root);
            if (res.body.paths[path.sep + root])
              fs.writeFile(program.path + path.sep + root + path.sep + 'index.html', pug.renderFile('templates/object.pug', { object: root, info: res.body.paths[path.sep + root] }), () => {});
          }
        }
      })
  })
  .parse(process.argv);