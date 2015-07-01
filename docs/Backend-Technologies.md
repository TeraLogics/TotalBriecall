## [Bluebird](https://github.com/petkaantonov/bluebird) _(Open Source)_

Bluebird is an A+ promises library. We use it to help create synchronous operations in a completely asynchronous environment.

## [Chai](http://chaijs.com/) _(Open Source)_

Chai is a BDD / TDD assertion library for node and the browser. We use this library with for assertions in our unit tests.

## [Coveralls](https://coveralls.io/) _(Publicly Available)_

Coveralls is a code coverage utility. We use it to verify that our unit tests are covering all of the code we write.

## [Code Climate](https://codeclimate.com/) _(Publicly Available)_

Code Climate is a product that analyzes code in your repositories for security issues, known pitfalls, and development standards. We use it to generate a score of the overall health of the code and keep up to date with how the overall health of our code is.

## [Apidoc.js](http://apidocjs.com/ ) _(Open Source)_

Apidoc.js is an API documentation framework that uses JSDoc standards to dynamically generate API documentation. This is ideally a post build step to dynamically generate API documentation; however, in this project the API documentation is baked into the repository. See [Backend Design Evolution](Backend-Design-Evolution) for more information.

## [JSHint](http://jshint.com/) _(Open Source)_

JSHint is a community-driven tool to detect errors and potential problems in JavaScript code and to enforce your team's coding conventions. We use it as part of our continuous integration process to ensure that only code that conforms to our teams coding stanrdards is deployed.

## [David](https://david-dm.org/) _(Publicly Available)_

David is a dependency manager. It keeps track of our Node.js dependencies and watches for newer versions. We use this to keep aware of updates to our dependencies so we can have the latest features and security updates.

## [Express](http://expressjs.com/) _(Open Source)_

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. We use this as our primary web application server to serve our API and web content.

## [Heroku](https://www.heroku.com/)

Heroku is a leading PaaS solution allowing customers to focus on application development, not the infrastructure behind it. We use this as our PaaS solution. We chose it because of its easy integration with other tools, such as [GitHub](/docs/Tools.md#github) and [Travis CI](/docs/Backend-Technologies#travis-ci-open-source-hosted).

## [Mocha](http://mochajs.org/) _(Open Source)_

Mocha is a feature-rich JavaScript test framework running on node.js and the browser, making asynchronous testing simple. We use this as the core of our unit testing framework.

## [MongoDB](https://www.mongodb.org/) _(Open Source)_

MongoDB is a document based data store. We use it for session handling and as our primary data store.

## [New Relic](http://newrelic.com/) _(Paid)_

New Relic is a software/system analytics and data collection platform which provides real-time and historical data about your software and system. We use this as a piece of our [Continuous Monitoring](/docs/Continuous-Monitoring.md) solution.

## [Node.js](https://nodejs.org/) _(Open Source)_

Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient - perfect for data-intensive, real-time applications that run across distributed devices. This is used as our primary application container.

## [Pingdom](https://www.pingdom.com/) _(Paid)_

Pingdom is a website monitoring tool which keeps track of uptime. We use this as a piece of our [Continuous Monitoring](/docs/Continuous-Monitoring.md) solution.

## [Sinon](http://sinonjs.org/) _(Open Source)_

Sinon is a library that provides standalone test spies, stubs, and mocks for JavaScript. We use it to help mock objects in our unit tests.

## [StatusPage.io](https://www.statuspage.io/) _(Paid)_

StatusPage.io is a tool which allows our customer to see an externally hosted status page for the overall health of our site. 'Is the site up?' is the question this solution answers. It provides an easy way for users to get notifications of downtime and a platform for operations to communicate with simple statuses. We use this as a piece of our [Continuous Monitoring](/docs/Continuous-Monitoring.md) solution.

## [Supertest](https://github.com/visionmedia/supertest) _(Open Source)_

Super Test provides a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by super-agent. We use this to help mock HTTP objects in our unit tests so we can test our route controllers.

## [Travis CI](https://travis-ci.org/) _(Open Source Hosted)_

Travis CI is a hosted continuous integration platform designed to help open source projects test their code. We use Travis CI as our continuous integration solution. It also has other integration which is nice too.

## [Underscore](http://underscorejs.org/) _(Open Source)_

Underscore is a JavaScript library that provides many useful, functional programming helpers without extending any built-in objects. We use this as a core piece of our application for general purpose, collection, iteration, and object manipulation.
