# Notes API

## Description

The Notes-API contains the server side application required for the submission of Web Application Develepment course at University of Nyíregyháza.  
The task is create a React based application in TypeScript by using the services of this API.

## Requirements
Node.JS at least version 18  
yarn

## Setup

```bash
$ yarn install
```

After installation creata a `.env` file next to package.json. This contains the necessary additional configuration. Content:
```bash
API_PORT=5000
LANGUAGE=hu-HU
# sample value - override is highly suggested
JWT_TOKEN_SECRET=This1s@secr3tKey
```
The value of JWT_TOKEN_SECRET can be freely change, only affects the login. The API_PORT defines the server starting point.

## Running the application

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Swagger
The complete API documentation can be found after starting the application in the `/api-doc` url: http://localhost:5000/api-doc