# FROM ubuntu:18.04
# RUN apt update
# RUN apt-get update
# RUN apt update
# RUN apt-get update
# RUN apt-get install npm -y
FROM alpine
RUN apk add npm
RUN mkdir angular
WORKDIR angular/.
COPY package.json package.json
RUN npm install
COPY . .
ENTRYPOINT ["npm", "start"]
