/* 
 * Copyright 2014 Fulup Ar Foll
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
 * 
 * Freely inspired from Codava-doc config
 */

var path = require("path");
var fs=require("fs");
var exec = require('child_process').spawnSync;

function callback(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
}

function main(config, argv) {
    
    if (argv.prod && argv.dev) {
        console.log ("Prod & Dev Mode are exclusive");
        process.exit();
    }
        
    var jkyConf = [];
    jkyConf.push (path.join (config.CONFIG_DIR, config.CONFIG_FILE));
    jkyConf.push (path.join (config.CONFIG_DIR, config.VERSION_RELEASE));
    jkyConf.push (path.join (config.DATA_DIR, "tocs", config.DEFAULTS_FILE));

    // add build-specific config files
    if (argv.prod) jkyConf.push(path.join (config.CONFIG_DIR, config.CONFIG_PROD));
    else jkyConf.push(path.join(config.CONFIG_DIR, config.CONFIG_DEV));
    if (argv.watch) 

    // add a special exclude file if "nodocs" was specified
    if (argv.nodocs) jkyConf.push(config.NODOCS_CONFIG_FILE);

    // build default command line args
    optAtgs = [];
    
    if (argv.serve) optAtgs.push ("serve");
    else  optAtgs.push ("build");
    
    optAtgs.push ("--config", jkyConf);
    
    if (argv.prod) {
        optAtgs.push ("--destination", config.DST_PROD);
        optAtgs.push (config.JEKYLL_PROD_FLAGS);
    } else {
        optAtgs.push ("--destination", config.DST_DEVL);
        optAtgs.push (config.JEKYLL_DEV_FLAGS);        
    }
    
    if (config.SITE_DIR) optAtgs.push ("--source", config.SITE_DIR);
    if (argv.watch) optAtgs.push ("--watch");
    if (argv.incremental) optAtgs.push ("--incremental");
            
    if (argv.verbose) console.log ("  + %s %s", config.CMD_JEKYLL,  optAtgs.join(' '));
    output = exec (config.CMD_JEKYLL,optAtgs, { stdio: 'inherit'});
    
    if (output.status !== 0) {
        console.log ("HOOPS: cmd=%s failed err=%s", config.CMD_JEKYLL, output.error);
    } else if (argv.verbose)  console.log ("  + gen_htlm done");
}


// if started as a main and not as module, then process test.
if (process.argv[1] === __filename) {
    var argv = require('minimist')(process.argv.slice(2));
    var config= require("../lib/_Config")("docs");
    main(config, argv);
}

module.exports = main;