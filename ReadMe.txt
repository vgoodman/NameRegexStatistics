First off, you'll need to get node and npm: https://docs.npmjs.com/getting-started/installing-node
Run "npm install" to get the node modules.
Run gulp to compile, minimize and revision the src files. The gulp command will just run in the background and no
To run the app, type "npm start" in the console.
Once the node server has started, you can go to: http://localhost:8070/ to see your application.

For testing:
Windows:  set NODE_ENV=production
          npm start
Mac: NODE_ENV=test npm start
Go to: http://localhost:8070/ to run the tests
