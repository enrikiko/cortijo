FROM ubuntu:18.04
RUN apt-get update
RUN apt update
RUN apt-get install npm -y
RUN mkdir angular
WORKDIR angular/.
COPY ./../fronAng/. .
ENTRYPOINT ["ng", "serve"]
