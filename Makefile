SOURCES ?= ./app
TESTS ?= ./test
NPM_BIN ?= ./node_modules/.bin

include support/mk/node.mk
include support/mk/mocha.mk

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

clobber: clean npm-uninstall


.PHONY: test test-cov lint lint-tests submit-cov ci-travis clean clobber
