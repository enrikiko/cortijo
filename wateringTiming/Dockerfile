# FROM ubuntu:18.04
# RUN apt-get update
# RUN apt update
# RUN apt-get install -y curl nodejs npm
# RUN apt install -y man less
FROM alpine
RUN apk add curl
RUN mkdir /root/bash
WORKDIR /root/bash
COPY . .
ENTRYPOINT ["sh", "init.sh"]
