DOCBUILD=../doctools/webdocs/docbuild

VERBOSE=--verbose

all: help

help: 
	@echo "Usage:"
	@echo "- make clean: clean all generated files"
	@echo "- make build: build the site"
	@echo "- make push: push the built site"
	@echo "- make serve: serve the site"

.PHONY: clean
clean:
	$(DOCBUILD) $(VERBOSE) --clean


.PHONY: build
build:
	$(DOCBUILD) $(VERBOSE) --fetch --force --build

.PHONY: push
push:
	$(DOCBUILD) $(VERBOSE) --fetch --force --build --push

.PHONY: serve
serve: 
	$(DOCBUILD) $(VERBOSE) ---fetch --force --build --serve

