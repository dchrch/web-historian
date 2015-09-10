var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt') // archiveHelpers/../archives/sites.txt
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
exports.readListOfUrls = function(callback){
  callback = callback || _.identity;
  fs.readFile(exports.paths.list, function(err, file) {
    callback(file.toString().split("\n"));
  });
};


exports.isUrlInList = function(url, callback){
  callback = callback || _.identity;
  exports.readListOfUrls(function(list) {
    callback(_.find(list, function(item) {
      return item === url;
    }));
  });
};


exports.addUrlToList = function(url, callback){
  callback = callback || _.identity;
  exports.isUrlInList(url, function(item){
    if (item === undefined) {
      fs.appendFile(exports.paths.list, "\n" + url, function(err){
        if (err){
          throw err;
        }
        exports.readListOfUrls(callback);
      });
    }
  });
};


exports.isUrlArchived = function(url, callback){
  callback = callback || _.identity;
  var filePath = path.join(exports.paths.archivedSites, url);
  fs.stat(filePath, function(err, stats) {
    if (err) {
      console.log('File does not exist');
      callback();
    } else {
      callback(url);
    }
  });
};


exports.downloadUrls = function(urlArray){
  urlArray.forEach( function(url) {
    request("http://" + url, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var filePath = path.join(exports.paths.archivedSites, url);
        fs.writeFile(filePath, body, function (err) {
          if (err) {
            throw err;
          }
        });
      }
    });
  });
};
