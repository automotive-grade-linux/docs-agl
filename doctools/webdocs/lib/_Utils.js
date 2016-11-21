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

var toolspath=path.resolve(path.join(__dirname,".."));

var GetConfig=function (extension) {
    
    if (!config) {
    
		// copy site path if specified
		var sitedir="site";
        if (argv.site && typeof argv.site === "string") {
            sitedir = argv.site;
        }
		sitedir=path.resolve(sitedir);

		// export for other config files
        process.env.SITE_DIR = sitedir;

        // Make sure we get site config first
        config=require(__dirname+"/_Config")(extension);

		var siteConfPath=path.resolve(path.join(sitedir, "../conf/AppDefaults.js"));
		if (!fs.existsSync(siteConfPath)) {
			console.log("Site configuration file not found in %s. Please specify correct site dir with option --site=...",siteConfPath);
			process.exit(1);
		}
        try {
			console.log("Loading site config at %s",siteConfPath);
            siteConfig=require(siteConfPath);
        } catch(error){
            console.log ("Invalid configuration file %s -- %s",siteConfPath,error);
            process.exit(1);
        }
        
        // if default change default language
        if (siteConfig.LANG_DEFAULT) process.env.LANG_DEFAULT=siteConfig.LANG_DEFAULT;

        // load DocsTools config and merge it local config
        for (var value in siteConfig) config[value] = siteConfig[value];  

		// override SITE_DIR
		config.SITE_DIR=sitedir;
    }
    return config;
};

var RequestQueue = function (filename) {
    var docstool = require(path.join(toolspath, filename));
    if (typeof docstool !== "function") {
        console.log ("HOOP: not a valid node.js function [%s]", path.join(toolspath, filename));
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
