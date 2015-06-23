COVERALLS ?= coveralls

submit-istanbul-lcov-to-coveralls: npm-install-global
	$(COVERALLS) < $(ISTANBUL_LCOV_INFO_PATH)


.PHONY: submit-istanbul-lcov-to-coveralls
