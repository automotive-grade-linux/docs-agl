/*
 * Copyright 2016 IoT.bzh
 * author: Fulup Ar Foll
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *    http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *limitations under the License.
 */

$(document).ready(function() {
"use strict";
    var umltag = "UML";
    var flowtag= "FLOW";
    var debug  = "";

    var elements = document.getElementsByTagName('code');
    
    for(var idx=0; idx < elements.length; idx++) {
        var style; var parser;
        var element = elements[idx];
        var subclass= element.className.split('-');
        
        // overright style if needed
        if (subclass.length > 1) {
            switch (subclass[1]) {
                case umltag: {
                   parser =  Diagram;
                   break;
                }
                
                case flowtag: {
                   parser =  flowchart;
                   break;
                }
                
                default: 
                   continue;
            }

            if (subclass.length > 2) style= subclass[2];
            else style= "simple";
            
            var source = element.innerText;
            if (!debug) element.innerText="";
            var iDiv = document.createElement('div');
            element.appendChild (iDiv);
                
            try {
                var diagram=parser.parse (source);
                diagram.drawSVG(iDiv, {theme: style});               
            } catch (err) {
                element.classList.add ("error");
                element.innerText="<p>Fail to process UML/Flow<p>" + source + "<br>" +err;
                console.log ("Error[%s]: class=%s err=%s diagram=%s", subclass[1], element.className, err, source);               
            }
        }        
    }

    }
);

