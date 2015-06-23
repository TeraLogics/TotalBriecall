COVERALLS ?= $(NPM_BIN)/coveralls

submit-istanbul-lcov-to-coveralls:
	$(COVERALLS) < $(ISTANBUL_LCOV_INFO_PATH)


.PHONY: submit-istanbul-lcov-to-coveralls
