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

// Runtime config will be:
//  - initialized with default from doctools/webdocs/conf/AppDefaults.js
//  - overridden by this config

config = {
	DST_PROD   : "build-prod",
	DST_DEVL   : "build-dev",
	VER_CURRENT: "2.x",
    
//	PUSH_DEST  : "apache@some.sample.server:/srv/www/docs/",
//	CRAWL_PROD : "http://some.sample.server/",
	PUSH_DEST  : "apache@www.ovh.iot:/srv/www/iotbzh/webdocs-sample/",
	CRAWL_DEV  : "http://docs.iot.bzh",
	CRAWL_PROD : "http://docs.iot.bzh",

	LANGUAGES: ['en','fr'],
    
    //GEM_FILE : "Absolute Path to GemFile when not within DOCS_TOOLS directory"

	// content not accessible through gerrit (see SPEC-1155)
	//GERRIT_FETCH: "https://gerrit.automotivelinux.org/gerrit/gitweb?p=%repo%.git;a=blob_plain;f=%source%;hb=%commit%",
	// alternate url using cgit
	GERRIT_FETCH: "https://git.automotivelinux.org/%repo%/plain/%source%?h=%commit%",
	AGL_GERRIT_BRANCH : "master",

	LAST: undefined
};

module.exports = config;

