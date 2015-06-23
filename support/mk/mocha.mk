MOCHA ?= ./node_modules/.bin/mocha
_MOCHA ?= ./node_modules/.bin/_mocha
MOCHA_REPORTER ?= spec
MOCHA_REQUIRE ?= ./test/bootstrap

test-mocha: npm-install
	$(MOCHA) \
		--reporter $(MOCHA_REPORTER) \
		--require $(MOCHA_REQUIRE) \
		--recursive \
		$(TESTS)


.PHONY: test-mocha
