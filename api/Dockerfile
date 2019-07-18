#FROM enriqueramosmunoz/rolling:mongo
FROM ubuntu:18.04
RUN apt update

RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN mkdir /root/node
WORKDIR /root/node
RUN apt-get update
RUN apt update
COPY package/. .
RUN npm install
COPY . .
RUN touch log.txt
RUN apt install man less more
RUN apt install mc
RUN apt install yum
RUN apt install dnf
ENTRYPOINT ["sh", "init.sh"]
