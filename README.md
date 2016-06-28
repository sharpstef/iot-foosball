# FoosBuzz
A Raspberry Pi wired Foosball table that uses the Watson IoT Foundation, Cloudant, and Node-RED

## Getting the Code Running
This is a demo application so the bulk of the code is a series of Node-RED flows.  We recommend running
this application in Bluemix, but you can easily run it in any environment with Cloudant(CouchDB) and Node-RED.  

Before you start to implement please review the instructions and bugs at our documentation page: http://slkaczma.github.io/iot-foosball

#### Key Components
1. [**Node-RED**](https://github.com/node-red/node-red) - The app runs Node-RED embedded in an Express application. Refer to server.js.
2. [**Twitter App Credentials**](https://apps.twitter.com/) - You need to create an app with Twitter to use the Passport OAuth Login for users.
3. [**Cloudant**](https://cloudant.com/) - noSQL database that stores the game and player data.  The game database should be populated with two initial files totalGames and 1 to avoid errors in gameplay. 

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/slkaczma/iot-foosball)

# Privacy Notice

Sample web applications that include this package may be configured to track deployments to [IBM Bluemix](https://www.bluemix.net/) and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/IBM-Bluemix/cf-deployment-tracker-service) service on each deployment:

* Node.js package version
* Node.js repository URL
* Application Name (`application_name`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)
* Labels of bound services
* Number of instances for each bound service and associated plan information

This data is collected from the `package.json` file in the sample application and the `VCAP_APPLICATION` and `VCAP_SERVICES` environment variables in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix to measure the usefulness of our examples, so that we can continuously improve the content we offer to you. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

## Disabling Deployment Tracking

Please see the README for the sample application that includes this package for instructions on disabling deployment tracking, as the instructions may vary based on the sample application in which this package is included.

# Contributors
Version 2 of this code is a collaboration between [Stefania Kaczmarczyk](https://github.com/slkaczma), [Oliver Rodriquez](https://github.com/odrodrig), and [Vance Morris](https://github.com/vmorris). 

