ISTANBUL ?= istanbul
ISTANBUL_OUT ?= ./reports/coverage
ISTANBUL_REPORT ?= lcovonly
ISTANBUL_LCOV_INFO_PATH ?= $(ISTANBUL_OUT)/lcov.info

test-istanbul-mocha: npm-install-global npm-install
	$(ISTANBUL) cover \
	--dir $(ISTANBUL_OUT) \
	--report $(ISTANBUL_REPORT) \
	$(_MOCHA) -- \
		--reporter min \
		--require $(MOCHA_REQUIRE) \
		--recursive \
		$(TESTS)


.PHONY: test-istanbul-mocha
