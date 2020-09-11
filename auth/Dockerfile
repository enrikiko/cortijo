# FROM ubuntu
# RUN apt update
FROM alpine
RUN apk add npm
# RUN apt-get update
# RUN apt-get install -y nodejs npm
#RUN apt install -y openssh-client
RUN mkdir /root/node
WORKDIR /root/node
COPY package/. .
RUN npm install
COPY . .
ARG TOKEN
#ENTRYPOINT ["node", "server.js"]
CMD node server.js
