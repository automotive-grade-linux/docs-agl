DOCBUILD=../doctools/webdocs/docbuild

VERBOSE=--verbose

FETCHTS=.fetch.ts

all: help

help: 
	@echo "Usage:"
	@echo "- make clean: clean all generated files"
	@echo "- make fetch: fetch the site if necessary"
	@echo "- make build: build the site"
	@echo "- make push: push the built site"
	@echo "- make serve: serve the site"

.PHONY: clean
clean:
	$(DOCBUILD) $(VERBOSE) --clean
	rm -f $(FETCHTS)

$(FETCHTS): $(wildcard site/_tocs/*/fetched_files.yml)
	$(DOCBUILD) $(VERBOSE) --fetch --force
	touch $@

.PHONY: fetch
fetch: $(FETCHTS)
	@echo "Fetched files up to date."

.PHONY: build
build: $(FETCHTS)
	$(DOCBUILD) $(VERBOSE) --build

.PHONY: push
push: $(FETCHTS)
	$(DOCBUILD) $(VERBOSE) --build --push

.PHONY: serve
serve: $(FETCHTS)
	$(DOCBUILD) $(VERBOSE) --build --serve

