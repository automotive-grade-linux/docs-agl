Introduction
============

This repository contains AGL documentation tools to automatically generate a technical website from Markdown files.

The tool relies on https://jekyllrb.com and proposed scripts are largely inspired from https://github.com/apache/cordova-docs

Installing
==========

## dependencies on Jekyll
- NodeJs+npm
- Ruby
- RubyGems
- Python
- Jekyll

Follow Jekyll instalation at https://jekyllrb.com/docs/installation/
Add Gem SCSS with "sudo gem install sass"

On OpenSuse on any other Linux plateform installation should be as simple as
```
 sudo zypper install nodejs
```
check your nodejs version:
```
node --version
	v4.6.1
```
You need a recent version of nodejs > 4.6
```
 cd doctools/webdocs/
 npm install
 sudo zypper install ruby2.1-devel
 sudo zypper install '*rubygem-ffi' 
 sudo gem install jekyll
 sudo ln -sf /usr/bin/jekyll.* /usr/bin/jekyll
```
IMPORTANT: check that "jekyll" command exist.
```
jekyll -version
```

WARNING: 
+ would you choose to install everything through GEM bypassing your
standard distribution package management, this may impose you to compile 
a couple of Ruby native extentions. If "gem install" fails you probably
miss some required tools like: gcc, libffi-devel-gcc5, ...
+ This command should display jekyll+rouge+sass :
```
gem search --local | grep -E "jekyll|rouge|sass" 
	jekyll (3.3.1)
	jekyll-sass-converter (1.5.0)
	jekyll-watch (1.5.0)
	rouge (1.11.1)
	sass (3.5.0.pre.rc.1)
	sass-listen (3.0.7)
```

## generate a 1st site from your template

```
 cd docs-agl/webdocs-agl
 ../doctools/webdocs/docbuild --verbose --clean --force --fetch
 ../doctools/webdocs/docbuild --verbose --build --serve --watch
```
point a browser on http://localhost:4000
```
xdg-open http://localhost:4000
```

## bugs

``
--watch to automatically regenerate pages on markdown file, you should force "./build --configs" when changing TOC or versions.
``

## references

+ Search Engine https://community.algolia.com/docsearch/
+ Markdown to HTML generation https://jekyllrb.com
+ Scripts from Cordova http://cordova.apache.org/docs

