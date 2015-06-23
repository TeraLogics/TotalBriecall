COVERALLS ?= coveralls

submit-istanbul-lcov-to-coveralls:
	npm install --global coveralls
	$(COVERALLS) < $(ISTANBUL_LCOV_INFO_PATH)
	npm uninstall --global coveralls


.PHONY: submit-istanbul-lcov-to-coveralls
