## Deployment of the application

We will be using a containerized version of deployment using the docker.

We will use Nginx as a reverse proxy for the nodejs application.

The Nginx server is listening on port 80 for http and the nodejs server is listening on port 8080.

The Nginx server is containerized in a docker container and listening on 80 and bind to the host 80 port.
The nodejs server is bind to the docker container to 8080:8080

## Deployment on AWS

- Create a AWS EC2 instance
- SSH into the instance
- Install Docker
- Run docker compose up command which automatically creates all the container images and runs them.
