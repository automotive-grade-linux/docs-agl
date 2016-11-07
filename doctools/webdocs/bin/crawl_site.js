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

var crawler    = require("simplecrawler");

function main (config, argv) {   
    
    var uri;
    
    if (argv.prod) uri=config.CRAWL_PROD;
    else uri=uri=config.CRAWL_DEV;
    
    if (!uri) {
        console.log ("ERROR: CRAWL_DEV/PROD not defined in AppConfig.js");
        process.exit(1);
    }
    
    crawler
        .crawl(uri)
        .on("fetch404", function(queueItem, response) {
            console.log("Status:%s from %s to %s", response.statusCode, queueItem.referrer, queueItem.path);
        })
        .on("fetchclienterror", function(queueItem) {
            console.log("ERROR: crawler site=[%s]", uri);
            process.exit (1);
        })
        .on("complete", function(queueItem) {
           if (argv.verbose) console.log ("  + crawler done"); 
        });
}

// if started as a main and not as module, then process test.
if (process.argv[1] === __filename) {
    var config= require("../lib/_Config")("docs");
    var argv = require('minimist')(process.argv.slice(2));

    main(config, argv);
}

module.exports = main;