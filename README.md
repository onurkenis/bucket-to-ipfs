## Introduction :arrow_forward:
This API listens a specific pub/ sub notification, which is triggered by a cloud function after uploading a file to a specific bucket, and handles pinning the file to IPFS. Project is also bootstraped with Prisma, so that any logic on top of the flow can be easily integrated.

## What is used :zap:
 - IPFS
 - Google Pub/ Sub
 - Typescript
 - Node JS
 - Express
 - MySQL
 - Prisma
 - Inversify
 - Neverthrow

## Local Development :computer:
1. Just run the following.
```shell
yarn start:dev
```

2. App will be up and running on port: 3000

## How to run :rocket: [*in progress*]
1. Create the docker image.
```shell
yarn dockerize
```

2. Run the containers.
```shell
yarn start
```

3. App will be up and running on port: 3000

## Endpoints :mag:
[Postman collection is available here.](API.postman_collection.json)