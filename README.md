Below is the assignment given to me by a Sydeny/Silicon valley based product company(startup)
# Problem statement :
Create a node/express app with:
- Endpoint to register an account (username/password)
-- Store passwords securely
- Endpoint to log a user in, which returns a session token
- Express middleware function to validate the session token
- Endpoint to receive a webhook with a stock ticker symbol and price (this needs to be unauthenticated)
- Endpoint to return the averages of the 10 most recent prices for a given ticker symbol
-- This endpoint should be authenticated
- API bodies should use JSON
- Use correct HTTP status codes
- Handle exceptions
- Add some tests
- Feel free to use whatever libraries you like
- No need for persistent storage - just keep everything in memory

# Solution:
- Git repo: https://github.com/nikhilyeole1/demo-node-app
- Code has many comments to explain my thought process.
- Creted/tested with node 12 but should work with node 10 too.
- I have used async-await but I am good with promises too.
- Created decoupled components(subapps / nested apps) to have separation on concerns. 'sub-apps' directory has nested mini apps.
So this monolith can be easily converted to microservices in future, if required. Any sub-app should only import "service" (and nothing else) from other sub-app.
- "$npm start" to start app.
- "$npm test" to run tests.
- Created integration and unit tests only for few functions to demonstrate.
- "$npm run build:jsdocs" to generate jsdocs in jsdocs directory". Have put jsdoc comments only for few functions to demonstrate.
- Validation of apis is done with "joi".
- "$npm run build:apidocs" to generate api documentation.  Made use of https://apidocjs.com/. New apidocs directory will be created.
- Please check this directory to see how to call apis. "postman-export" directory has exported apis which can be imported in postman and tested.
Apis are listed below in short:
```
1.
POST /users/signup
req body:
{
  username: 'a@b.com',
  password: 'pwd',
  name: 'Joe Smith' // Optional field
}

2.
POST /users/signin
req body:
{
  username: "a@b.com",
  passoword: "pwd"
}
response:
{
  sessionToken: "sdfxcedredfd" // To be sent as 'x-auth' header with authenticated /stocks/:tickerSymbol/average api.
}

3.
POST /stocks   // This is webhook that accepts ticker stock price. Is unauthenticated.
req body:
{
  tickerSymbol: 'goog',
  price: 850
}

4. GET /stocks/:tickerSymbol/average  // Is authenticated
headers
{
  x-auth: "sdfxcedredfd" // sessionToken value that we got from /users/signin api
}
```
