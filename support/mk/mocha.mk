MOCHA ?= /usr/bin/mocha
_MOCHA ?= /usr/bin/_mocha
MOCHA_REPORTER ?= spec
MOCHA_REQUIRE ?= ./test/bootstrap

test-mocha: npm-install
	$(MOCHA) \
		--reporter $(MOCHA_REPORTER) \
		--require $(MOCHA_REQUIRE) \
		--recursive \
		$(TESTS)


.PHONY: test-mocha
