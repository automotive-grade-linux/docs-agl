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

.PHONY: fetch
fetch:
	$(DOCBUILD) $(VERBOSE) --fetch --force 

.PHONY: build
build: fetch
	$(DOCBUILD) $(VERBOSE) --build

.PHONY: push
push: fetch
	$(DOCBUILD) $(VERBOSE) --build --push

.PHONY: serve
serve: fetch 
	$(DOCBUILD) $(VERBOSE) --build --serve

