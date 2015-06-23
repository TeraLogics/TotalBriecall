APIDOC ?= $(NPM_BIN)/apidoc
API_DIR ?= $(SOURCES)/routes
API_FILE_PATTERN ?= "^api.js$$"
OUTPUT_DIR ?= $(SOURCES)/views/docs/api

apidoc: npm-install-global
	$(APIDOC) \
		--file-filters $(API_FILE_PATTERN) \
		--input $(API_DIR) \
		--output $(OUTPUT_DIR)


.PHONY: apidoc
