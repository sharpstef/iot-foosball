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


## Contributors
Version 2 of this code is a collaboration between [Stefania Kaczmarczyk](https://github.com/slkaczma), [Oliver Rodriquez](https://github.com/odrodrig), and [Vance Morris](https://github.com/vmorris). 

