DOCBUILD=../doctools/webdocs/docbuild

VERBOSE=--verbose

FETCHTS=.fetch.ts
LOCALFETCH=.LocalFetch.ts

all: help

help: 
	@echo "Usage:"
	@echo "- make clean: clean all generated files"
	@echo "- make fetch: fetch the site if necessary"
	@echo "- make localFetch: fetch the site if necessary but use local file."
	@echo "- make build: build the site"
	@echo "- make push: push the built site"
	@echo "- make serve: serve the site"

.PHONY: clean
clean:
	$(DOCBUILD) $(VERBOSE) --clean
	rm -f $(FETCHTS)
	rm -f $(LOCALFETCH)

$(LOCALFETCH): $(wildcard contain/toc/*/fetched_files.yml)
	$(DOCBUILD) $(VERBOSE) --localFetch --fetch --force
	touch $(FETCHTS)
	touch $@

$(FETCHTS): $(wildcard contain/toc/*/fetched_files.yml)
	$(DOCBUILD) $(VERBOSE) $(LOCAL_FETCHTS) --fetch --force
	touch $@

.PHONY: fetch
fetch: $(FETCHTS)
	@echo "Fetched files up to date."

.PHONY: localFetch
localFetch: $(LOCALFETCH) $(FETCHTS)
	@echo "Fetched files up to date and copy local file."

.PHONY: build
build: $(FETCHTS)
	$(DOCBUILD) $(VERBOSE) --build

.PHONY: push
push: $(FETCHTS)
	$(DOCBUILD) $(VERBOSE) --build --push

.PHONY: serve
serve: $(FETCHTS)
	$(DOCBUILD) $(VERBOSE) --build --serve

