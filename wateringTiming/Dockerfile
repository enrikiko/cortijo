FROM ubuntu:19.04
RUN apt-get update
RUN apt-get install -y curl
RUN mkdir /root/bash
WORKDIR /root/bash
COPY . .
ENTRYPOINT ["sh", "init.sh"]
