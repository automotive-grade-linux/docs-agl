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

var fs           = require("fs");
var path         = require("path");
var childProcess = require("child_process");

var yaml = require("js-yaml");
var Q    = require("q");

var augment = require("../lib/augment_toc");
var util    = require("../lib/misc_helpers");


function genToc (argv, config, tocDir, item) {
    
    var docsDir  = path.join(config.DOCS_DIR, item);
    
    // go through all the languages
    util.listdirsSync(docsDir).forEach(function (languageName) {
        var languagePath = path.join(docsDir, languageName);
        
        // go through all the versions
        util.listdirsSync(languagePath).forEach(function (versionName) {
            var versionPath = path.join(languagePath, versionName);

            var srcTocName  = util.srcTocfileName(languageName, versionName);
            var destTocName = util.genTocfileName(languageName, versionName);

            var srcTocPath  = path.join(tocDir, srcTocName);
            var destPath = path.join (config.DATA_DIR, "tocs", item);
            if(!fs.existsSync(destPath)) fs.mkdirSync(destPath);
    
            var destTocPath = path.join (destPath, destTocName);

            if (argv.verbose) console.log("  + " + srcTocPath + " -> " + destTocPath);
            
            // read the input
            var data = fs.readFileSync(srcTocPath);
            
            // augment the ToC
			var originalToc        = yaml.load(data.toString());

			var augmentedToc       = augment.augmentToc(originalToc, versionPath);

			var augmentedTocString = yaml.dump(augmentedToc, {indent: 4});
            var warningComment     = util.generatedBy(__filename);
            var output             = warningComment + "\n" + augmentedTocString;

            // write the output
            fs.writeFileSync(destTocPath, output);

			// generate index.html from title and template name
			if (originalToc.template) {
				var idxpath = path.join(versionPath,"index.html");
				if (argv.verbose) console.log("  + "+idxpath+" : template="+originalToc.template+" name="+originalToc.name); 
				var buf="---\n";
				if (originalToc.name) buf+="title: "+originalToc.name+"\n";
				buf+="---\n\n";
				buf+="{% include "+originalToc.template+" %}\n";
				fs.writeFileSync(idxpath,buf);
			}
        });
    });
}

   
function main (config, argv) {
    
    // open destination _default.yml file
    var destdir = path.join (config.DATA_DIR, "tocs");
    if(!fs.existsSync(destdir)) fs.mkdirSync(destdir);
    
    var tocs = fs.readdirSync(config.TOCS_DIR);
    for (var item in tocs) {
        var tocDir  = path.join (config.TOCS_DIR, tocs[item]);
        var verFile = path.join (config.TOCS_DIR, tocs[item], config.VERSION_LATEST);
        
        genToc (argv, config, tocDir, tocs[item]);
    }
    if (argv.verbose) console.log ("  + get_tocs done");

}

module.exports = main;
