Introduction
============

This repository contains AGL documentation website sources, rendering is visible at http://docs.automotivelinux.org
This website relies on the generator located in doctools/webdocs.

Installing
==========

## dependencies: webdoc

See how to install webdocs: read file in doctools/webdocs/README.md

## configure webdoc

Edit conf/AppDefault
+ Default configuration consider that webdoc tools  & site are within the same parent directory.
+ If needed, update Doc_TOOLS to the right path.

## generate a 1st site from your template
```
 ./build --clean  # deleted all generated file if any
 ./build --fetch [--force]  # collect doc from github (fetch list in site/_tocs/*/fetch_files.yml)
 ./build --build --serve --watch --incremental # build config/tocs, generate html and start a local webserver

  browser on http://localhost:4000

 ./build --push --verbose # push generated to production webserver (check conf/AppDefault 1st)
```

## start writing documentation

- the directory ./site holds your website contend
- site/* directories not prefixed with "_" represent en entry within the menu
- site/_* directory contains template, configuration, options
- site/_data is a special directory that hold both static and generated files to adjust page/site values within html pages
- site/_tocs/*/toc_VERSION_LANGUAGE.yml TOC(TableOfContend) and GitFetch definition (ex: appfw)
- site/_layouts holds page template 

- register at https://community.algolia.com/docsearch/ and update your apikey into conf/_config.yml


## bugs

```
 --watch to automatically regenerate pages on markdown file, you should force "./build --configs" when changing TOC or versions.
```

