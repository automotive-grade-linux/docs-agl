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
 */

var path= require("path");

// Default config will be:
//  - completed with default from DOCS_TOOLS/conf/AppDefault.js
//  - superseaded by ProjectRoot/.config-???.js $HOME/.config-???.js /etc/default/config-???.js
config = {
    
    DST_PROD   : "build-prod",
    DST_DEVL   : "build-dev",
    VER_CURRENT: "2.x",
    
    SITE_DIR   : "site",
    DOCS_TOOLS : "../doctools/webdocs",
    
    PUSH_DEST  : "apache@some.sample.server:/srv/www/docs/",
    CRAWL_PROD : "http://some.sample.server/",

    LANGUAGES: ['en','fr'],
    
    //GEM_FILE : "Absolute Path to GemFile when not within DOCS_TOOLS directory"
    LAST: undefined
};

module.exports = config;

