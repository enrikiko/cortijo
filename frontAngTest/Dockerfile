FROM ubuntu:18.04
RUN apt-get update --no-ca
RUN apt update
RUN apt-get install npm -y --no-cache
RUN mkdir angular
WORKDIR angular/.
COPY ./../fronAng/. .
ENTRYPOINT ["ng", "serve"]
