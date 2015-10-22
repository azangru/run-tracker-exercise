# Description

This is an exercise of building a simple full-stack JavaScript-based application. The application registers users and allows them to keep track of their jogging by storing the information about distance, time and date of each run.

The backend is built in Node and Express. It uses a relational database to store records and uses Sequelize as an ORM. The client is a single-page application that communicates with the client over AJAX requests. The application uses json web tokens as an authentication system.

The exercise provides examples of:

- safely storing user’s password by hashing it with bcrypt
- using json web tokens to identify the user
- a simple authorization system (a user can have one of three roles — common user, user manager or admin; each role has its own set of permissions)
- tests of the backend API (mostly integration tests with Supertest; written using Mocha and Chai)

The project contains unit tests using mocha, chai, and supertest.

# Scripts

## Installation (building)
- npm install
- gulp build-prod

## Running
- npm start

## Testing
- npm test
