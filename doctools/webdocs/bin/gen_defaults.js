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

var fs   = require("fs");
var path = require("path");
var yaml = require("js-yaml");

var util = require("../lib/misc_helpers");

// constants for sitemap.xml
// reference:
//      http://www.sitemaps.org/protocol.html#xmlTagDefinitions
var LATEST_CHANGE_FREQUENCY = "monthly";
var LATEST_PAGE_PRIORITY    = 0.8;

var DEFAULT_CHANGE_FREQUENCY = "monthly";
var DEFAULT_PAGE_PRIORITY    = LATEST_PAGE_PRIORITY / 2;

var DEV_CHANGE_FREQUENCY = "daily";
var DEV_PAGE_PRIORITY    = LATEST_PAGE_PRIORITY / 4;

function genDefault (argv, config, defConf, item) {

    // create defaults config
    var docsRoot = config.DOCS_DIR;
    var docsBase = path.basename (config.DOCS_DIR);
    var docDir  = path.join(docsRoot, item);

    // make sure doc directory really exist
    if(!fs.existsSync(docDir)) {
        console.log ("HOOPS: Not Found doc dir=[%s]", docDir);
        process.exit (1);
    }
    

    // set defaults for each language
    util.listdirsSync(docDir).forEach(function (langName) {

        var langPath = path.join(docsRoot, item, langName);
        var languageDefaults = {
            scope: {
                path: path.join (docsBase, item, langName)
            },
            values: {
                language: langName,
                layout:   item + "-" + langName
            }
        };

        defConf.defaults.push(languageDefaults);

        // set defaults for each version
        util.listdirsSync(langPath).forEach(function (versionName) {

            var tocfile = util.genTocfileName(langName, versionName);

            var changeFrequency = DEFAULT_CHANGE_FREQUENCY;
            var pagePriority    = DEFAULT_PAGE_PRIORITY;

            // adjust priority and frequency based on version
            if (versionName === config.VERSION_TAGDEV) {
                changeFrequency = LATEST_CHANGE_FREQUENCY;
                pagePriority    = LATEST_PAGE_PRIORITY;
            } else if (versionName === defConf.DEV_VERSION) {
                changeFrequency = DEV_CHANGE_FREQUENCY;
                pagePriority    = DEV_PAGE_PRIORITY;
            }

            var current = false;
            if (versionName === config.VERSION_TAGDEV || versionName === defConf.DEV_VERSION) {
                current = true;
            }

            var versionDefaults = {
                scope: {
                    path: path.join (docsBase, item, langName, versionName)
                },
                values: {
                    version:          versionName,
                    tocdir:           item,
                    tocfile:          tocfile.replace(".yml", ""),
                    change_frequency: changeFrequency,
                    priority:         pagePriority,
                    current:          current
                }
            };

            defConf.defaults.push(versionDefaults);
        });  
    });
      
    if (argv.verbose) console.log("  + " + docDir + " (addto _defaults.yml)");
}

function main (config, argv) {
    
    // open destination _default.yml file
    var destdir = path.join (config.DATA_DIR, "tocs");
    if(!fs.existsSync(destdir)) fs.mkdirSync(destdir);
    
    var fileout = fs.openSync(path.join (destdir, config.DEFAULTS_FILE), 'w');
    fs.writeSync (fileout, util.generatedBy(__filename) +'\n');
    
    var defConf = {"defaults": []};

    var tocs = fs.readdirSync(config.TOCS_DIR);
    for (var item in tocs) {
        var tocDir  = path.join (config.TOCS_DIR, tocs[item]);
        
        genDefault (argv, config, defConf, tocs[item]);
    }

    // write yaml defaults config file
    fs.writeSync (fileout, yaml.dump(defConf, {indent: 4}) +'\n');   
    if (argv.verbose) console.log ("  + get_defaults done");

}

// if started as a main and not as module, then process test.
if (process.argv[1] === __filename) {
    var config= require("../lib/_Config")("docs");
    var argv = require('minimist')(process.argv.slice(2));

    main(config, argv);
}

module.exports = main;
