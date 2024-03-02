# Nodejs Task

1. Post ID should start from 1000 and be incremental.
   - I am thinking this way ==> The post ID the user gives while creating a new post should be greater than 10000

TO install the app in your machine install the following applications

- Git
  `git clone `
  Start Hacking
- Nodejs
  `cd app`
  `npm install` This install all the dependencies
  `populate the environment variables`
  `npm run dev` This runs tha application in dev mode

To run the app in your machine install the following applications

- Docker
  `docker-compose up --build`
  which installs all the dependencies(LINUX Container,NGINX, NODEJS,etc)

To use the application.
Go to browser and send a request to http://localhost which will send that request to NGINX reverse proxy which redirects to the NodeJS application running in 8080 port.
