#FROM enriqueramosmunoz/rolling:mongo
FROM ubuntu:18.04
RUN apt update
RUN apt install -y man
RUN apt install -y less
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
# RUN apt install -y more
# RUN apt install -y mc
# RUN apt install -y yum
# RUN apt install -y dnf
ENTRYPOINT ["sh", "init.sh"]
