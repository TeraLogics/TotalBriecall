# Test Tools

The NodeJS community has several tools for unit testing, performance testing, and integration testing.

## Unit/Integration Tests

We chose [Mocha](http://mochajs.org/) for our unit and integration testing. Mocha is open source, regularly updated, and designed to work well for asynchronous testing which is great for JavaScript applications.

## Continuous Integration

**_Since this is a public repository, the results are also public and available at: https://travis-ci.org/TeraLogics/TotalBriecall_**

[Travis CI](https://travis-ci.org/) is an externally hosted CI system that integrates very well with open and private [GitHub](https://github.com) projects as well with our code coverage utilities and with [Heroku](http://heroku.com). We chose [Travis CI](https://travis-ci.org/) for its integration points, easy to use interface and reporting mechanisms. Since [Travis CI](https://travis-ci.org/) is open source it can be hosted internally with the appropriate resources.

### Set Up

Setting up [Travis CI](https://travis-ci.org/) was really easy. All we needed to do was to sign in with our [GitHub](https://github.com) account, Sync our repositories, and turn on integration for our repository. We also added a `.travis.yml` file to our code repository and added a few instructions to it to tell [Travis CI](https://travis-ci.org/) what to do.

### Configuration
Our custom `.travis.yml` file is configured to tell [Travis CI](https://travis-ci.org/):

* What version(s) of NodeJS we wanted to test against
* What our additional testing dependencies are
* Our [Heroku](http://heroku.com) configuration
* [Slack](https://slack.com/) configuration

We provided our [Heroku](http://heroku.com) information so that once our build passed, test results could be passed on so an automated deployment decision could be made by [Heroku](http://heroku.com)  based on the passing score of our tests. As long as all of our unit tests pass, [Heroku](http://heroku.com) will go ahead and deploy our code to the live running instances.

Additionally, we included JSHint in the CI process such that failure to conform to the standards defined in our JSHint configuration would also cause a build to fail.

We also decided to integrate [Slack](https://slack.com/), which our team uses for communication, so that the team gets notified when a build passes or fails.

Lastly, our build process also includes generation of a code coverage report and submission of that report to [Coveralls](https://coveralls.io/). See below for more details.

### Results

[Travis CI](https://travis-ci.org/) keeps track of our build history and provides views into the build process and the test results so we know exactly what tests or build processes failed, so we can take corrective action.

![Travis CI Results](https://raw.githubusercontent.com/wiki/TeraLogics/TotalBriecall/images/TravisCIResults.png)

It also generates a badge image that shows whether or not the build is passing or errored. This is tagged directly at the top of the [README.md](https://github.com/TeraLogics/TotalBriecall/blob/master/README.md)

![Badges](https://travis-ci.org/TeraLogics/TotalBriecall.svg?branch=master)

## Code Coverage

### [Istanbul](https://gotwarlost.github.io/istanbul/)

[Istanbul](https://gotwarlost.github.io/istanbul/) is an open-source code coverage utility that works hand-in-hand with [Mocha](http://mochajs.org/) to generate code coverage based on unit tests.

![Istanbul Results](https://raw.githubusercontent.com/wiki/TeraLogics/TotalBriecall/images/CoverageSummary.png)

It generates a file (`.lcov`) that is a global format for coverage results and can be imported into many different tools for analysis. [Istanbul](https://gotwarlost.github.io/istanbul/) can also generate an HTML report, but we use the `.lcov` file and submit it to [Coveralls](https://coveralls.io/) because their interface is public, is easier to use, and provides additional functionality.

### [Coveralls](https://coveralls.io/)

**_Since this is a public repository, the results are also public and available at: https://coveralls.io/r/TeraLogics/TotalBriecall_**

Much like [Travis CI](https://travis-ci.org/), [Coveralls](https://coveralls.io/) is an externally hosted code coverage tool that also integrates very well with open and private [GitHub](https://github.com) projects. It is not open source, but is open for public use. We use this tool not because it is necessary, but because it provides additional functionality to the coverage reports that [Istanbul](https://gotwarlost.github.io/istanbul/) provides.

[Coveralls](https://coveralls.io/) provides a better web visualization of our coverage statistics, coverage history, and the ability to look at multiple repository branches for coverage (if reported). It provides overall coverage statistics for the entire project and generates a badge image that shows our final code coverage for the project. This is tagged directly at the top of the [README.md](https://github.com/TeraLogics/TotalBriecall/blob/master/README.md)

[![Coverage Status](https://coveralls.io/repos/TeraLogics/TotalBriecall/badge.svg?branch=master)](https://coveralls.io/r/TeraLogics/TotalBriecall?branch=master)

This is the second to last part of our CI build process.  As long as all of our tests pass, and [Istanbul](https://gotwarlost.github.io/istanbul/) completes successfully, the results are posted to [Coveralls](https://coveralls.io/).

### [Code Climate](https://codeclimate.com/)

**_Since this is a public repository, the results are also public and available at: https://codeclimate.com/github/TeraLogics/TotalBriecall_**


[Code Climate](https://codeclimate.com/) is another add-on utility (which is not open source but is available for public use) that we use to generate a score of the overall health of the code. It takes into consideration the code coverage, language style, security issues, and overall quality of the code. It identifies known pitfalls in languages and security, and provides visibility into the places in the code base that contain potential issues. It also points out places where code is duplicated, could be simplified, is syntactically incorrect, or is just plain wrong. It tracks these items over time and creates a quality score for them on a file by file basis. This is tagged directly at the top of the [README.md](https://github.com/TeraLogics/TotalBriecall/blob/master/README.md)

[![Code Climate](https://codeclimate.com/github/TeraLogics/TotalBriecall/badges/gpa.svg)](https://codeclimate.com/github/TeraLogics/TotalBriecall)

## Dependency Management

### [David](https://david-dm.org/)

**_Since this is a public repository, the results are also public and available at: https://david-dm.org/TeraLogics/TotalBriecall_**

[David](https://david-dm.org/) is a dependency manager. It allows our team to visually identify when NodeJS package dependencies are out of date. We use this as an informational point in order to keep up to date with the latest feature/security releases for the dependencies we use. This is tagged directly at the top of the [README.md](https://github.com/TeraLogics/TotalBriecall/blob/master/README.md)

[![Dependency Status](https://david-dm.org/TeraLogics/TotalBriecall.svg)](https://david-dm.org/TeraLogics/TotalBriecall)
