MOCHA ?= ./node_modules/.bin/mocha
_MOCHA ?= ./node_modules/.bin/_mocha
MOCHA_REPORTER ?= spec
MOCHA_REQUIRE ?= ./test/bootstrap

test-mocha: node_modules
	$(MOCHA) \
		--reporter $(MOCHA_REPORTER) \
		--require $(MOCHA_REQUIRE) \
		--recursive \
		$(TESTS)


.PHONY: test-mocha
