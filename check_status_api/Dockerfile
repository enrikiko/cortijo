FROM ubuntu:18.04
RUN apt update
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN mkdir /root/node
WORKDIR /root/node
RUN apt-get update
RUN apt update
COPY package/. .
RUN npm install
COPY . .
ENTRYPOINT ["sleep", "5", "&&", "node", "server.js"]
