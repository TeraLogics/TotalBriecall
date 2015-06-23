JSHINT ?= jshint

lint-jshint: npm-install-global
	$(JSHINT) $(SOURCES)

lint-tests-jshint: npm-install-global
	$(JSHINT) $(TESTS)


.PHONY: lint-jshint lint-tests-jshint
