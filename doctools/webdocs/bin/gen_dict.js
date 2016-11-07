// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

"use strict";

var fs       = require("fs");
var path     = require("path");
var yaml     = require("js-yaml");
var walk     = require("walk");
var glob     = require("glob");
var Q        = require("q");

var util = require("../lib/misc_helpers");

// helpers
function pathToURI(filePath, rootPath) {
    return filePath
        .replace(new RegExp("^" + rootPath), "")
        .replace(new RegExp("\\.md$"), ".html");
}

function pagesFromRedirects(redirects, docDir, languages, pages) {
    var prefix = '/' + docDir ;

    // add docs redirects
    for (var redirectSource in redirects) {

        // add an entry for the redirect's source, once for each language
        for (var i = 0; i < languages.length; i++) {
            var language = languages[i];
            var pagePath = prefix + '/' + language + '/' + redirectSource;
            pages[pagePath] = true;
        }
    }
}

function isInLatestDocs(uri, latestVersion) {
    return uri.indexOf("/" + latestVersion + "/") !== (-1);
}

// main
function main (config, argv) {
    
    var siteRootPath      = config.SITE_DIR;
    var redirectsFilePath = config.REDIRECTS_FILE;
    var latestVersion     = config.VER_CURRENT;
    var languages         = config.LANGUAGES;
    
    // pages to return
    var pages = {};
    
    // add pages for redirects if a redirects file was passed
    if (redirectsFilePath !== null) {

        var redirectsString = fs.readFileSync(redirectsFilePath);
        var redirects       = yaml.load(redirectsString);
        
            // get list of directory with TOC
            var tocs = fs.readdirSync(config.TOCS_DIR);
            for (var item in tocs) {
                var docDir  = tocs[item];
                var tocDir  = path.join (config.TOCS_DIR, tocs[item]);
        
                if (fs.existsSync(tocDir) && redirects[docDir]) {
                    pagesFromRedirects(redirects[docDir], docDir, languages, pages);
                }
            }
            
    }

    // add entries for all Markdown files in the site root
    var allMarkdownFiles = path.join(siteRootPath, "**/*.md");
    var filePaths = glob.sync(allMarkdownFiles);
    for (var i = 0; i < filePaths.length; i++) {
        var filePath = filePaths[i];
        var fileURI  = pathToURI(filePath, siteRootPath);

        // add the page
        pages[fileURI] = true;

        // also add /latest/ version for pages in latest docs
        if (isInLatestDocs(fileURI, latestVersion)) {
            var latestURI = fileURI.replace("/" + latestVersion + "/", config.LATEST_ALIAS_URI);
            pages[latestURI] = true;
        }
    }

    var fileout = fs.openSync(config.ALL_PAGES_FILE, 'w');
    fs.writeSync (fileout, util.generatedBy(__filename) +'\n');
    fs.writeSync (fileout, yaml.dump(pages)); 
    if (argv.verbose) console.log("  + (dict) -> " + config.ALL_PAGES_FILE);

    if (argv.verbose) console.log ("  + gen_dict done");
}

// if started as a main and not as module, then process test.
if (process.argv[1] === __filename) {
    var config= require("../lib/_Config")("docs");
    var argv = require('minimist')(process.argv.slice(2));

    main(config, argv);
}

module.exports = main;