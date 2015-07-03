https://www.totalbriecall.com

# Total Briecall

[![Build](https://travis-ci.org/TeraLogics/TotalBriecall.png)](https://travis-ci.org/TeraLogics/TotalBriecall)
[![Coverage Status](https://coveralls.io/repos/TeraLogics/TotalBriecall/badge.svg)](https://coveralls.io/r/TeraLogics/TotalBriecall)
[![Quality](https://codeclimate.com/github/TeraLogics/TotalBriecall.png)](https://codeclimate.com/github/TeraLogics/TotalBriecall)
[![Dependencies](https://david-dm.org/TeraLogics/TotalBriecall.png)](https://david-dm.org/TeraLogics/TotalBriecall)

TeraLogics, LLC. is the prime contractor delivering a widely used web application to DoD and IC communities. We've grown DISA’s UVDS  system from a prototype into one of the most used DoD websites by executing 2 week sprints, deploying weekly, and communicating directly with users stationed all over the world. Our program requirements allow us to develop innovative user-focused features, release quickly, and make the entire government team lean and efficient. Our iterative approach differs from standard government processes and acquisitions, but our results validate that there are better and faster ways to deliver software in the government. 

Our team has extensive experience with continuous monitoring, accreditation and system security from our work in the DoD. We use security tools like SCAP, ACAS, and Retina on our IaaS operational production systems. For this project, the team determined a PaaS would allow us to focus on application delivery, instead of infrastructure hardening. We developed our application with security in mind, using HTTPS, session encryption, and other secure web practices. 

##The Agile Delivery Services Team

Our ADS I Team was comprised of technical experts (filling six roles from the “Pool 3” Labor Category table) assembled to design, develop, and deploy a working prototype in accordance with the ADS RFQ requirements and an internally defined schedule and budget. Our Product Manager (PM) led the team through the agile development process, assigning roles, defining prototype development strategy, and communicating technical implementation objectives. The PM operated as the sole source of technical authority for end-to-end production of the prototype and was responsible for ensuring the final product met all defined requirements. In the Agile Coach (AC) role, our Certified Scrum Master supported the PM in the facilitation of our sprint cycles. 

##TeraLogics’ Agile Development Process 

The RFQ’s short turn-around and the requirement to apply the principles of the U.S. Digital Services Playbook, synchronized well with our standard development procedures.  We leveraged our communication tools (Slack) and  sprint tracker (Trello) and adapted them from our existing 2-week sprint process to three condensed, 2-day sprint cycles focused on incrementally delivering a working prototype. For this project, we used feedback from real people to solve the problems of delivering food recall information in a meaningful way. User engagement through demos and feedback sessions influenced the planning, development, and refinement of our prototype design. Human centered design principles that influenced the prototype included: building an interdisciplinary team of collaborative thinkers, framing the design around user impacts and needs, ideation, live prototyping, and conducting user interviews and testing to fully understand the needs and preferences of the user audience.

##Planning and Discovery

In the planning and discovery stage, our team collaborated to explore innovative and useful prototype submission options within the RFQ parameters, FDA dataset, and high level user feedback. We interviewed users to build user stories and better understand their needs. This feedback was captured and tracked using Trello, a collaborative organizational and planning tool managed by our Agile Coach. These factors culminated in a sprint planning meeting where the PM collaborated with the team to set realistic priorities, estimate effort, and establish deadlines for each sprint cycle. The AC set and tracked task assignments, details, and deadlines in accordance with the final sprint plan.

##Design

In order to ensure a thorough, impactful and engaging solution, the design stage included a review of the FDA dataset, development of a plan to meet overall design/implementation objectives, and a technology discussion. With this in mind, the team engaged in collaborative discussions on the desired user impacts of our prototype, resulting in the following criteria:
  - collect and centralize data about defective products
  - make information quickly understandable to users
  - display information for maximum relevance to users

Framing our design within the context of user needs, we wanted to create personalized product recalls for users based on their location, preferences and interests. Geographical display is inherently self-organizing to the dataset since the data is localized and users are typically concerned with recalls impacting their area. In the spirit of this BPA's fresh approach to acquisition, the team decided to name the project using a play-on-words of Food and Recalls: Total Briecall.

The team decided to use Heroku PaaS to rapidly build and deploy our application without needing to manage the underlying infrastructure. We used 10 open source technologies to design/build the front end of the prototype (Bootstrap, Leaflet, EJS, jQuery, and more). We used 15 open source or publically available technologies for the backend development (Node.js, Mongo, Express, Mocha, and more). Technologies used to create and run the prototype are modern, openly licensed, and free of charge. 

To ensure a user-centric design, the team created visual mockups of the user interface to create an initial plan for displaying the dataset to users. This step included generation of a simple, flexible design style guide to set the prototype design standard. The design considered how users would interact with the prototype, what devices they would access the data from (both responsive and accessible from multiple devices), and how they interact with other modern websites. Our primary design goal was to ensure the prototype was intuitive and easy to use. 

By soliciting continuous feedback on design mockups and implementations, our solution improved the ease and intuitiveness of the application. The first sprint iteration reviewed the design mockups using the review tool, InVision, including input on general site layout, search, and viewing capabilities. This feedback impacted  the first release of the prototype. Users provided two additional rounds of feedback on the prototype in the second and third sprint cycles requesting features like images associated with recall ingredients, a map view associated with local or regional recall notices, and formatting of displayed recall information. This feedback resulted in a simple, clean design approach for how users access, view, and share the displayed data in the final prototype.

##Development

To reduce the risk of failure and continue to improve the software through user feedback, during the early development stages of the sprint cycles, we employed rapid prototyping to quickly build and test various components of the prototype, including localizing product defect information and formatting product information display. The system was designed using the Model-View-Controller design pattern. The prototype was deployed to a publicly available Git repository. We used GitHub for version control of Total Briecall by setting up a repository, making basic commits, then branching out from the master into development branches.

Along with general feature development, our developers were also responsible for writing and running unit tests before committing code. If any unit tests failed, the team would resolve the issues and rerun the unit test to ensure quality. The team also assisted in documenting output, running integration tests, and running load tests. The CI processes ensured the code builds and the tests passed before pushing changes to the live system.  The team also validated builds, CI reports, and hand tested our staging environments.

Part of our quality control process included code reviews. If the change was a basic bug fix, a developer would review the code to make sure it followed our design style guide and that it was free of logic or security issues. If there was a large change or a feature addition, the team would review the code for style, complexity, logic issues, security issues, and general requirement implementation.

##Usability Testing

In order to ensure a simple and intuitive interface, we leveraged our usability testers who were not directly involved in prototype design or development. The users provided feedback in each sprint, using their own devices to test the production site and providing input on Trello cards. Their feedback changed each sprint as the team addressed their needs and suggestions, helping the team refine the usability of the final prototype.

##Deployment

To ensure the quality and reliability of the code, we ran iterative deployments of our software through production and development environments, both connected to Travis CI, merging development into the master repository regularly. The team monitored the prototype using open source, continuous integration tools to test and validate code quality (Travis CI, Heroku tools). The Mocha JavaScript test framework was used for unit and integration testing. Choosing to use the Heroku PaaS solution greatly reduced the configuration management tasks for Total Briecall. We also verified our software worked in a Docker Container by creating and testing a simple Dockerfile, included in our Git repository. Installation instructions to deploy the Total Briecall prototype on other machines, as well as other sprint related documentation, are included in the [Git repository] (https://github.com/TeraLogics/TotalBriecall/blob/development/Home.md). 
