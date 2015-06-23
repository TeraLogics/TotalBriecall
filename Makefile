SOURCES ?= ./app
TESTS ?= ./test

test: test-mocha
test-cov: test-istanbul-mocha
lint: lint-jshint
lint-tests: lint-tests-jshint
submit-cov: submit-istanbul-lcov-to-coveralls

# ==============================================================================
# Node.js
# ==============================================================================
include support/mk/node.mk
include support/mk/mocha.mk
include support/mk/istanbul.mk
include support/mk/apidoc.mk

# ==============================================================================
# Analysis
# ==============================================================================
include support/mk/notes.mk
include support/mk/jshint.mk

# ==============================================================================
# Reports
# ==============================================================================
include support/mk/coveralls.mk

# ==============================================================================
# Continuous Integration
# ==============================================================================
ci-travis: apidoc lint lint-tests test test-cov

# ==============================================================================
# Clean
# ==============================================================================
clean:
	rm -rf build
	rm -rf reports
	rm -rf app/views/docs/api

clobber: clean clobber-node


.PHONY: test test-cov view-cov lint lint-tests submit-cov ci-travis clean clobber
