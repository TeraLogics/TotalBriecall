SOURCES ?= ./app
TESTS ?= ./test

include support/mk/node.mk
include support/mk/mocha.mk
include support/mk/apidoc.mk

include support/mk/istanbul.mk
include support/mk/coveralls.mk
include support/mk/notes.mk
include support/mk/jshint.mk

# ALIASES
test: test-mocha
test-cov: test-istanbul-mocha
lint: lint-jshint
lint-tests: lint-tests-jshint
submit-cov: submit-istanbul-lcov-to-coveralls

# CONTINUOUS INTEGRATION
ci-travis: lint lint-tests test-cov

# CLEAN
clean:
	rm -rf build
	rm -rf reports
	rm -rf app/views/docs/api

clobber: clean npm-uninstall npm-uninstall-global


.PHONY: test test-cov lint lint-tests submit-cov ci-travis clean clobber
