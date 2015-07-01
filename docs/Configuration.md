# *Configuration Settings*

* `MONGOLAB_URI` - The url to the mongo DB instance.
* `NEW_RELIC_LICENSE_KEY` - The license key for New Relic.  Not required.
* `NODE_ENV` - The environment. (**default** = ``"production"``)
* `PORT` - The port to listen on. (**default** = `5000`)
* `SECRET` - The secret to use for encryption. (**default** = `foobarbaz`)
* `SESSIONLENGTH` - The session length in milliseconds. (**default** = `3600000`)
* `OPENFDA_KEY` - The OpenFDA API key.  Not required.

# Editing the configuration

1. Click on 'Personal Apps' in the left hand menu
1. Click on your application (ex. 'total-briecall-example')
1. Click the 'Settings' menu link at the top
1. Scroll to the 'Config Variables' section
1. Click on the 'Reveal Config Vars' button
1. Click the 'Edit' button
1. Add/modify configuration variables per the configuration

![Config](https://raw.githubusercontent.com/wiki/TeraLogics/TotalBriecall/images/heroku-config.gif)
