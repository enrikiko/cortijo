FROM ubuntu:18.04
RUN apt update
RUN apt-get update
RUN apt update
RUN apt-get update
RUN apt-get install npm -y
RUN npm install angular -y
RUN mkdir angular
WORKDIR angular/.
COPY . .
ENTRYPOINT ["sh", "init.sh"]
