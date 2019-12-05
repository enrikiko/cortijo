#FROM enriqueramosmunoz/rolling:mongo
FROM ubuntu:18.04
RUN apt update
RUN apt-get update
RUN apt install -y man less
RUN apt-get install -y curl nodejs npm
RUN apt install -y openssh-client
RUN mkdir /root/node
WORKDIR /root/node
COPY package/. .
RUN npm install
COPY . .
ENV TOKEN=cortijo1
ENTRYPOINT ["sh", "init.sh"]
