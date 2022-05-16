<p align="center">
  <img src="./public/logo2.png" alt="Sublime's custom image"/>
</p>

  <h1 align="center">CURA-OPS</h1>
 
 >## Organization use-case

 _____

 ## Key Features
  * Authentication and Authorization of organization.
  * Basic **CRUD** operations for the organization.
  * Create Practitioner and Practitioner role for organizations.
  * Add/Create Healthcare Services for the organization.
  * Aggregate the number of different practitioner roles in real time.
  * Real time Location of Healthcare Services offered by the organizations.
  * Detailed Swagger open api and Postman documentation

___

## API Usage
*Before using the API, you need to set the variables in Postman depending on your environment (development or production). Simply add:*

```
{{url}} should be your hostname value. eg. http://127.0.0.1:3000 or www.myapi.com
```

# Technologies used
  * [Express.js]() :
    * back end web application framework for Node.js.
  * [Mongodb](www.mongodb.com) :
    *  cross-platform NoSQL database program.
  * [Mongoose](https://mongoosejs.com/):
    * JavaScript object-oriented programming library that creates a connection between MongoDB and the Express web application framework.
  * [Swagger](https://swagger.io) : 
    * Interface Description Language for describing RESTful APIs expressed using JSON or Yaml.
  * [Mocha](https://mochajs.org/) :
    *  JavaScript test framework for Node.js programs, featuring browser support, asynchronous testing, test coverage reports, and use of any assertion library.
  * [Chai](https://www.chaijs.com/) :
    * Chai is a BDD / TDD assertion library for node.
  * [Pug](https://pugjs.org): 
    * High performance template engine. It was used for email templating in this case.


# Installation Guide
You can fork the app or you can git-clone the app into your local machine. Make sure you have mongodb installed on your local machine and enable the mongod service. click the link below for the installation guide for the mongodb.
  * [macOS](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)
  * [Ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)
  * [Windows](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)

  once installed, go ahead and download this dependencies by running the code below.

  ```
  npm install
  npm run dev (for developement)
  npm run start (for production)

```

# Environmental Variables
create a config.env file in the root folder and paste the following variables below.

```
NODE_ENV=development
PORT=3000
DATABASE_LOCAL=mongodb://127.0.0.1:27017/yourDbName
JWT_SECRET={Your_jwt_secret_password}
JWT_EXPIRES_IN={access_token_expires_in_days}
JWT_COOKIE_EXPIRES_IN={your_cookies_expires_in}
EMAIL_USERNAME={your_email}
EMAIL_PASSWORD={your_email_password}
EMAIL_HOST={your_email_provider_host}
EMAIL_PORT={your_email_provider_port}

```
# Documentation
  ## Open-api documentation:  
    url: http://localhost:3000/api/v1/api-docs
  
  ## Postman Documentation
  [Click Here](www.google.com)


  # License
  Copyright (c) 2021 [Nameksolutions](nameksolutions.com)

  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
