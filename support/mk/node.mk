GLOBAL_NPM_PACKAGES ?= istanbul coveralls jshint apidoc

npm-install-global:
	npm install --global $(GLOBAL_NPM_PACKAGES)

npm-uninstall-global:
	npm uninstall --global $(GLOBAL_NPM_PACKAGES)

npm-install:
	npm install

npm-uninstall:
	rm -rf node_modules


.PHONY: clobber-node
