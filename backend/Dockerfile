FROM node:20


WORKDIR /home/node

COPY package.json .

RUN npm install

COPY . .






CMD [ "npm","start" ]
#docker network create node-network
# docker run -d -p 3307:3306 --network=node-network -e MYSQL_ROOT_PASSWORD=1234 --name node-mysql mysql
#docker build . -t img-node
#docker run -d -p 8080:8080 --network=node-network --name cons-node img-node
