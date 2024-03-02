FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
# our app is running on port 5000 within the container, so need to expose it
EXPOSE 5000

# the command that starts our app
CMD ["node", "index.js"]