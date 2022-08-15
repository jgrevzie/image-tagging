# Overview
This project deploys a cloud service providing
 - token authentication
 - image uploading
 - downloading
 - tagging
 - search by tags and dates
 - logging of requests with user and user agent

The architecture consists of
 - serverless cloud functions (Firebase Cloud Functions)
 - a cloud based database (Google Cloud Firestore)
 - cloud storage (Google Cloud Storage)

Please see below for the reasoning behind these technology choices.

# Setup & Prerequisites
To deploy, you will need a firebase project.
Go to https://firebase.google.com/ and 'Get Started'. You'll be walked through the
(very simple) process of setting up your account.

*Note - you will need to upgrade to a 'Blaze' plan to deploy and run the functions.*

Install the firebase tools, ie
`npm install -g firebase-tools`

## .env file
The project contains a sample.env file. Copy this to .env and choose a 'master token'
(see below).

# Install

`cd functions && npm i`

# Running the Tests

`cd functions && npm test`

# Deployment

Authenticate with your firebase project

`firebase login`

(this will open a browser)

Deploy to the cloud

`cd functions && npm deploy`

The above will output the **base url** of the deployed routes

e.g. `https://us-central1-image-tagging-c73e6.cloudfunctions.net/api`

## Alternative deployment via emulation

The project can be run locally using the firebase emulator suite.
`npm run serve`

The output will indicate the base url for the routes below.

# Authentication
The project uses a simple token based auth system. Each token is stored in the database
and associated with a username.

The master token in .env can always be used. New tokens are added using a route (see below).

Tokens are authorization bearer tokens 

e.g. `Authorization: Bearer token_here`

This header will need to be added to all requests.

# Routes

**(all routes require above authentication)**

| **Path**                   | **Explanation**    | **Inputs**                                                                                                                                                                                                                                                                | **Ouputs**                                                                  |
|----------------------------|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `POST /images/`            | Upload file        | Multi-part form request, with field `file` set to the uploaded file. Content type and file name determined automatically.                                                                                                                                                 | The id of the file, to be used with other requests.                         |
| `PATCH /images/:id`        | Add tag to file    | JSON body with the property `tag`. e.g. `{ "tag": "some-tag" }`                                                                                                                                                                                                           | `OK`                                                                        |
| `GET /images/`             | Search for files   | Optional query params <br/>`tag` (search by tag) <br/>`startDate` (ISO datetime, search from here)<br/>`endDate` (ISO datetime, search to here). <br/>If no params are passed, then all image ids are returned.<br/>Date spec here https://en.wikipedia.org/wiki/ISO_8601 | Array of matiching image ids                                                |
| `GET /images/:id`          | Download image     | `id` is the image id                                                                                                                                                                                                                                                      | Response is the bytes of the image, with correct content type and file name |                                                     |
| `GET /images/:id/metadata` | Get image metadata | `id` is the image id                                                                                                                                                                                                                                                      | Metadata, including file name, upload datetime, content type, tags          |                                                            |
| `POST /tokens`             | Add auth token     | JSON body e.g. `{ "token": "secret-token", "user": "some-user }`                                                                                                                                                                                                          | `OK`                                                                        |

# Logging

The project uses a middleware to log all access to the routes including
 - username
 - path
 - user agent

The logs are available via `npm run logs` and are also visible and searchable in the Firebase dashboard.


# Tech Choices and Overall Approach

The basic goal was to keep this as simple as possible.

Firebase was chosen because of ease of setup and DevOps. Other alternatives, such as k8s, with docker containers for the db,
helm carts etc, would have been more time-consuming to set up.

Cloud Functions are simple, provide built in cloud logging, are inexpensive and scalable. They also provide auth,
but the built in auth tokens are hard to generate. For simplicity, simple auth tokens are used. Middleware is used to log
access events to the cloud.

The approach taken uses streaming to cloud storage. This allows very large files to be uploaded.

The firestore database is used for storing metadata and 'pointers' to files in cloud storage. This allows for tagging
and fast, useful searching.

Code quality via `prettier` and `eslint`.

## Dependency injection

Rather than using mocking, this project uses DI via a set of contexts that are passed into routing middlewares.
This enables clean testing, and separation of concerns.

## Testing

Unit tests have been provided. However, the project would benefit from integration tests. These could use the emulator
framework to save data, files etc (very fast) and check that the expected entities exist. There was not sufficient time to
build a suite of integration tests.

Thanks for the opportunity to build this project 😀
