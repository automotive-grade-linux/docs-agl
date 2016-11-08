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

var path=require("path");

var SITE_DIR=process.env.SITE_DIR; // must be set before by caller (_Util.js)
if (!SITE_DIR || (typeof SITE_DIR !== "string")) {
    console.log ("HOOPS: SITE_DIR env var not defined please use --site=xxxx");
    process.exit(1);
}

var LANG_DEFAULT= process.env.LANG_DEFAULT || 'en';

// default config, superseeded by $SITE_DIR/conf/AppDefaults.js
config = {
    
    DST_PROD   : "build-prod",
    DST_DEVL   : "build-dev",
    
    SITE_DIR   : SITE_DIR,
    DATA_DIR   : path.join (SITE_DIR, "_data"),
    TOCS_DIR   : path.join (SITE_DIR, "_tocs"),
    DOCS_DIR   : path.join (SITE_DIR, "docs"),
    
    VER_CURRENT   : "xx.x",
    VERSION_TAGDEV    : 'dev',
    VERSION_LATEST    : 'latest.yml', 
    VERSION_RELEASE   : '_release.yml', 
    VERSION_FILE      : '_versions.yml', 
    DEFAULTS_FILE     : '_defaults.yml',

    CONFIG_DIR        : "conf",
    CONFIG_FILE       : "_config.yml",
    CONFIG_VERSION    : "_version.yml",
    CONFIG_PROD       : "_prod.yml",
    CONFIG_DEV        : "_dev.yml",
    CONFIG_NODOCS     : "_nodocs.yml",
    
    LANGUAGES         : [LANG_DEFAULT],
    LANG_DEFAULT      : LANG_DEFAULT,
    
    JEKYLL_DEV_FLAGS  : ["--trace"],
    JEKYLL_PROD_FLAGS : [],
    
    SCSS_DIR          : path.join (SITE_DIR, "site/static/scss"),
    JS_DIR            : path.join (SITE_DIR, "static/js"),
    BIN_DIR           : "bin",
    
    LATEST_ALIAS_URI  : "/latest/",
    ALL_PAGES_FILE    : path.join (SITE_DIR, "_data/all-pages.yml"),
    REDIRECTS_FILE    : path.join (SITE_DIR, "_data/redirects.yml"),
    
    DEFAULT_GIT_DOC : "README.md",
        
    GEN_TOCS    : "bin/gen_tocs",
    GEN_VERS    : "bin/gen_versions",
    GEN_DEFS    : "bin/gen_defaults",
    GEN_HTML    : "bin/gen_html",
    GEN_DICT    : "bin/gen_dict",
    FETCH_DOCS  : "bin/fetch_docs",
    CLEAN_ALL   : "bin/clean_all",
    PUSH_SITE   : "bin/push_site",
    CRAWL_SITE  : "bin/crawl_site",
    CRAWL_DEV   : "http://localhost:4000", // should match jekyll serve url
    // CRAWL_PROD  : "TBD in Site AppConfig", // should match with production site
    
    RSYNC_CMD   : ["rsync", "-az",'.'], // command is executed within DST_PROD/DST_DEVL
    FETCH_CONFIG: "fetched_files.yml",
    FETCH_DIR   : "reference",
    
    GERRIT_FETCH: "https://gerrit.automotivelinux.org/gerrit/gitweb?p=%repo%;a=blob_plain;f=%source%;hb=%commit%",
    GITHUB_FETCH: "https://raw.githubusercontent.com/%repo%/%commit%/%source%",
    GITHUB_EDIT : "https://github.com/%repo%/blob/%commit%/%source%",
       
    CMD_JEKYLL  : "jekyll",
    
    ENDTAG : ""
};

module.exports = config;

