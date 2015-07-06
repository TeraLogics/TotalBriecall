# Developing and Designing Wisconsin Style

## Introduction

Our development process is fairly simple, as we believe that it should be. Typically, development processes are cumbersome by nature, but our Agile processes help to streamline that practice so our developers can produce quality deliverables without too many bureaucratic roadblocks. The next sections will describe the design and development process that we followed for this project.

## The Design Phase

### Mockups

Design can be a very complicated task, especially when there is a lot of input and that input is contradictory. However, we strive to make the design process clear and simple. Our UI/UX design process is an iterative human-centered process that evolves over time, implementing feedback and rethinking the user experience, all while maintaining simplicity and quality. 

The first design iteration consisted of a series of graphical mockups, cutups, and imagery that represented a draft view of what our stakeholders had requested through the initial user interviews. Many different design concepts were presented back to the stakeholders, feedback was gathered and implemented in the next iteration. The feedback collection part of the process never really ends, but when we had enough information, we then began to build the prototype.

This process looks slightly different when designing the back end. The mockups are still pictures and drawings, but look more like UML, Process Flow, and Architecture diagrams, instead of pretty pictures, buttons, and widgets. However the core of the process is the same, getting feedback, implementing, and rethinking.

For this project we used [InVision](http://www.invisionapp.com/) to help with user feedback, and collaboration. It served as a forum for collecting and addressing stakeholder feedback, while providing versioned iterations of our design.  It allowed us to see the history and evolution of the design so we could make sure that our future designs did not miss any requirements, or include failed features or overall bad ideas.

Here is the link to our InVision interactive design board: https://projects.invisionapp.com/share/UF3C22AEK#/screens

_Note: To see the stakeholder feedback turn on the comments in the bottom left._

### Rapid Prototyping

We usually attempt to get to this phase pretty quickly, because, lets face it, looking at pictures of a design isn't quite as cool as touching it. Rapid prototyping also allows us to dig in a little deeper on the user experience (UX) or the backend problems that may be found with initial designs. This process is where the prototype began to take shape, the concepts were fleshed out and the development of the product begins.  Once we have a stakeholder approved version of a prototype, the design phase begins to run parallel to the development phase as we began the work of actually making the buttons do actions, the links navigate, and the data flow.

We never really stop prototyping, but we do begin to focus more on making the product work as the design becomes fairly set. This doesn't mean that the design can't change or that issues, new requirements, and stakeholder feedback don't get implemented. It means that we begin to get more serious and start travelling down the road to completion.

## Development Process

Our development process is done in short cycles and includes both the design, implementation, and test phases of the product. We use several tools to ensure that we stay on task and on schedule. We keep track of our product backlog, open sprint tasks, and status in [Trello](http://www.trello.com). The entire team uses Trello to keep track of the status of in-flight tasks, time estimates on those tasks, and which tasks have been completed. This works hand in hand with our version control system and issue tracker to make sure the tasks are being pushed through the development process.

Our overall development process is fairly simple. Design -> Prototype -> Implement -> Test -> Deploy and repeat. Sometimes the deployment part doesn't happen, due to tests failing, which helps improve our reliability.

### Version Control

We used git for version control, primarily [GitHub](https://github.com/TeraLogics/TotalBriecall/blob/master/docs/Tools.md#github) for this project. We set up a repository, made some basic commits, then branched out from our master into a development branch:

![Branches](/docs/images/branches.png?raw=true)

Once our initial repository was set up and the branches were in place, we beganto  commit changes to the development branch. Once the development branch was in a stable state, we merged a batch changes into the master branch. If we had major features to develop, we created a feature branch based off of the development branch and worked on the feature.  Once the feature was complete it was merged back into the development branch.

![Git](/docs/images/Git.png?raw=true)

## Testing and Quality Control

These branches were hooked into our [Slack](http://slack.com) development channels so our team received notifications as commits were made.

![Slack Integration](/docs/images/SlackIntegration.PNG?raw=true)

Along with general feature development, our developers were also responsible for writing and running unit tests before committing code. If any unit tests fail, the team member became responsible for resolving the issues, and rerunning the unit test to ensure quality. The developers also work closely with the test teams to ensure that unit tests cover all test cases. Our test team also assisted in running unit tests, documenting output, running integration tests, and running load tests. Our CI processes were kicked off when our branches were committed. The CI process runs the unit tests on environments that look like our production environment. The test team was also responsible for validating builds, CI reports, and hand testing our staging environments.

### Code Reviews

Part of our quality control process included code reviews. If the change was a basic bug fix, another developer would review the code to make sure it followed our style guides and that it doesn't have logic issues or security issues. If the change was a larger change or a feature addition, the team would review the code for a variety of issues such as: style, complexity, logic issues, security issues, and general requirement implementation.

![Code Review](/docs/images/Code%20Review%20Meeting.jpg?raw=true)
### Code Climate

Code Climate is a tool that we use during our development process to evaluate the quality of our code over time. You can see a more detailed view of what it does and how it works on the [Continuous Integration](https://github.com/TeraLogics/TotalBriecall/blob/master/docs/Continuous-Integration.md#code-climate) wiki page. Ultimately, we use this tool to help our team identify pitfalls, and quality issues in our code. Our Testing/QC team is responsible for reviewing this content and reporting important issues.

![Code Climate](/docs/images/CodeClimate.png?raw=true)

### Issue tracking

Finally, we use GitHub's [issue tracker] (https://github.com/TeraLogics/TotalBriecall/issues) to track issues found while testing. These are either issues that are found through quality assurance testing or by product managers reporting production issues with the product and/or pointing out unfulfilled requirements. These issues are combined, put into the backlog, and prioritized back into the development process.
![GitHub Issues](/docs/images/github issues.png?raw=true)
