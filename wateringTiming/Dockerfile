FROM ubuntu:18.04
RUN apt-get update
RUN apt update
RUN apt-get install -y curl 
RUN mkdir /root/node
WORKDIR /root/node
COPY package/. .
RUN npm install
COPY . .
ENTRYPOINT ["sh", "init.sh"]
