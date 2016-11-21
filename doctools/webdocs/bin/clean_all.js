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
var fse  = require("fs-extra");

function remove(argv, path) {
    if (argv.verbose)  console.log("  + removing " + path);
    fse.removeSync(path);
}

// main
function main (config, argv) {
    
    var targetVersion  = config.VERSION_TAGDEV;
    var targetLanguage = config.LANG_DEFAULT;
    

    remove(argv,path.join(config.CONFIG_DIR, config.VERSION_RELEASE));
    remove(argv,config.DST_DEVL);
    remove(argv,config.DST_PROD);
    remove(argv,path.join(config.TOCS_DIR, config.VER_CURRENT));
    remove(argv,config.ALL_PAGES_FILE);
    remove(argv,path.join(config.TOCS_DIR, config.DEFAULTS_FILE));
	remove(argv,path.join(config.DATA_DIR, "tocs", config.DEFAULTS_FILE));
    remove(argv,path.join(config.DATA_DIR, "tocs", "*", "*.yml"));
    remove(argv,path.join(config.DATA_DIR, "tocs", "*", config.VERSION_FILE));
    
    var tocs = fs.readdirSync(config.TOCS_DIR);
    for (var item in tocs) {
        var destination= path.join (config.DOCS_DIR, tocs[item], targetLanguage, targetVersion, config.FETCH_DIR);
        remove(argv,destination);
        var idxpath= path.join (config.DOCS_DIR, tocs[item], targetLanguage, targetVersion, "index.html");
        remove(argv,idxpath);
    }
    
    if (argv.verbose) console.log ("  + clean_all done");
}

module.exports = main;
