FROM ubuntu:18.04
RUN apt-get update
RUN apt update
RUN apt-get install -y curl nodejs npm
RUN apt install -y man less
RUN mkdir /root/node
WORKDIR /root/node
# COPY package/. .
# RUN npm install
COPY . .
ENTRYPOINT ["sh", "init.sh"]
