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

// constants
var LANGUAGE_MAP = {
    "de": "Deutsch",
    "en": "English",
    "es": "Español",
    "fr": "Français",
    "it": "Italiano",
    "ja": "日本語",
    "ko": "한국어",
    "pl": "Polski",
    "ru": "Русский",
    "sl": "Slovene",
    "zh-cn": "简体中文",
    "zh-tw": "繁體中文"
};

function genVersion (argv, config, tocDir, item) {

    var versConf = {};
    var docsRoot = config.SITE_DIR;
    var docDir  = path.join(docsRoot, item);

    // go through directory that contains all languages
    util.listdirsSync(docDir).forEach(function (langId) {

        var langPath     = path.join(docDir, langId);
        var versionNames = util.listdirsSync(langPath);

        // get language ID
        var langName;
        if (langId in LANGUAGE_MAP) {
            langName = LANGUAGE_MAP[langId];
        } else {
            console.error("Language identifier '" + langId + "' doesn't have an associated name. Update (gen_versions.js) ");
            process.exit(1);
        }

        // set the language name and the versions it has
        versConf[langId] = {
            'name':     LANGUAGE_MAP[langId],
            'versions': versionNames
        };
    });

    var destPath = path.join (config.DATA_DIR, "tocs", item);
    if(!fs.existsSync(destPath)) fs.mkdirSync(destPath);
    
    var destTocPath = path.join (destPath, config.VERSION_FILE);
    var output = util.generatedBy(__filename) + '\n' + yaml.dump(versConf, {indent: 4});

    fs.writeFileSync(destTocPath, output);
    if (argv.verbose) console.log("  + (version) -> " + destTocPath);
}

function main (config, argv) {
    
    // open destination _default.yml file
    var destdir = path.join (config.DATA_DIR, "tocs");
    if(!fs.existsSync(destdir)) fs.mkdirSync(destdir);
    
    var version= "latest_docs_version: " + config.VER_CURRENT;
    var outfile= path.join (config.CONFIG_DIR, config.VERSION_RELEASE);
    fs.writeFileSync(outfile, version + '\n');
    if (argv.verbose) console.log("  + (release) -> %s", outfile);
    
    var tocs = fs.readdirSync(config.TOCS_DIR);
    for (var item in tocs) {
        var tocDir  = path.join (config.TOCS_DIR, tocs[item]);
        var verFile = path.join (config.TOCS_DIR, tocs[item], config.VERSION_LASTEST);
        
        if (fs.existsSync(verFile)) {
            genVersion (argv, config, tocDir, tocs[item]);
        }
    }
    
    if (argv.verbose) console.log ("  + fetch_versions done");

}

// if started as a main and not as module, then process test.
if (process.argv[1] === __filename) {
    var config= require("../lib/_Config")("docs");
    var argv = require('minimist')(process.argv.slice(2));

    main(config, argv);
}

module.exports = main;