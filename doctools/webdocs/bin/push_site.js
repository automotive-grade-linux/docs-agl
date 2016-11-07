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
var exec = require('child_process').spawn;
var fs   = require('fs');
var path = require('path');

// main
function main (config, argv) {
    
    var fromdir;
    
    if (!config.RSYNC_CMD) {
        console.log ("Hoop: RSYNC_CMD not defined in AppDefault.js");
        process.exit();
    }
    

    // exec command within target build site
    var command= config.RSYNC_CMD[0];
    var optAtgs=[];
    if (argv.verbose) optAtgs.push("--verbose");
    
    if (config.RSYNC_CMD.slice(1)) {
        config.RSYNC_CMD.slice(1).forEach (function (arg) {
            optAtgs.push (arg);
        });
    };

    if (argv.prod) fromdir= config.DST_PROD;
    else fromdir = config.DST_DEVL;

    if (!fs.existsSync (path.join (fromdir, "index.html"))) {
        console.log ('Hoop: No thing to push in ./%s [ --build ] option require', fromdir);
        process.exit();
    }
    

    process.chdir  (fromdir);
    optAtgs.push (config.PUSH_DEST);
    
    if (argv.verbose) console.log ("  + exec %s %s",  command, optAtgs.join(' '));
    exec (command, optAtgs, { stdio: 'inherit' });
}

// if started as a main and not as module, then process test.
if (process.argv[1] === __filename) {
    var config= require("../lib/_Config")("docs");
    var argv = require('minimist')(process.argv.slice(2));

    main(config, argv);
}

module.exports = main;