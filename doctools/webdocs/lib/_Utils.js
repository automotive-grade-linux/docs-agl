/* 
 * Copyright 2016 Fulup Ar Foll
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

    
var path= require("path");
var fs  = require("fs");
var argv= require("minimist")(process.argv.slice(2));
var config; // will be set at 1st getConfig call
var requests = [];

var GetConfig= function (extention) {
    
    if (!config) {
        
        // Make sure we get site config first
        var sitecfg= require(__dirname+"/lib/_Config")(extention);

        // get site main variable before loading tools default config
        if (argv.docstool && typeof argv.docstool === "string") {
            sitecfg.DOCS_TOOLS= argv.docstool;
        }

        process.env.SITE_PATH = sitecfg.SITE_DIR || "site";
        try {
            config= require(path.join("..", sitecfg.DOCS_TOOLS, "/tools/lib/_Config"));
        } catch(error){
            console.log ("Hoop --doctool=xxx needed (DocTools not at: [%s])\n-- %s", sitecfg.DOCS_TOOLS, error);
            process.exit(1);
        }
        
        // if default change default language
        if (config.LANG_DEFAULT) process.env.LANG_DEFAULT=config.LANG_DEFAULT;

        // load DocsTools config and merge it local config
        for (var value in sitecfg) config[value] = sitecfg[value];  
    }
    return config;
};

var RequestQueue = function (filename) {
    var docstool = require (path.join("..", config.DOCS_TOOLS, filename));
    if (typeof docstool !== "function") {
        console.log ("HOOP: not a valid node.js function [%s]", path.join (config.DOCS_TOOLS, filename));
        process.exit(1);
    }
    
    var arguments = [].slice.call(arguments, 1);
    requests.push ({filename: filename, cmd: docstool, config: config, argv: arguments[0]});
};

var ExecQueue = function (argv) {
    var idx=0;
    
    function ExecNext() {
        
        if (idx < requests.length) { 
            if (argv.verbose) console.log ("  - Process: %s",  requests[idx].filename);
            status = requests[idx].cmd (requests[idx].config, requests[idx].argv, ExecNext);
            idx++;
            if (!status) ExecNext();
        }
    }

    // execute 1st function
    ExecNext();    
};

var UtilMethods = {
    
  GetConfig     : GetConfig,  
  RequestQueue  : RequestQueue,
  ExecQueue     : ExecQueue,
  
  LAST: undefined
  };
  


module.exports = UtilMethods;
