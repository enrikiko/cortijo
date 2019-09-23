#FROM enriqueramosmunoz/rolling:mongo
FROM ubuntu:18.04
RUN apt-get update
RUN apt update
RUN apt-get install -y curl nodejs npm
RUN apt install -y man less
RUN mkdir /root/node
WORKDIR /root/node
COPY package/. .
RUN npm install
RUN touch log.txt
COPY . .
# RUN apt install -y more
# RUN apt install -y mc
# RUN apt install -y yum
# RUN apt install -y dnf
ENTRYPOINT ["sh", "init.sh"]
