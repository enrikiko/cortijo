# FROM ubuntu:18.04
# RUN apt-get update
# RUN apt-get install curl -y
FROM alpine
RUN apk add --update npm curl py-pip
RUN pip install requests
COPY functionalPing.sh functionalPing.sh
COPY ping.sh ping.sh
COPY check.py check.py
COPY functions.sh functions.sh
USER root
ENTRYPOINT ["./functionalPing.sh"]
