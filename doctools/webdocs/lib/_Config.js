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

var path=require('path');
var fs = require('fs');

function Config (extension) {
   'use strict';
   var values={};
   var conf;

   if (!extension) extension='.js';
   else extension= extension + '.js';

   // Configs file path last one superseeds first one.
   var files= [
	  "/etc/default/noderc"+extension,
	  path.join(process.env.HOME,".noderc"+extension),
	  process.env.NODERC,
      path.join(__dirname,"../conf/AppDefaults.js"),
   ];

   // Parse any existing files within config list & merge them
   for (var idx in files) { 
      if (files[idx]) {
        if (fs.existsSync (files[idx])) {
			console.log ("Loading tool config file "+files[idx]);  
			conf=require(files[idx]);
		}
        for (var i in conf) values[i] = conf[i];
      }     
   }
   
 // console.log ("values=", values);
 return values;
}

module.exports = Config;
