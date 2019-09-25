FROM ubuntu:18.04
RUN apt-get update
RUN apt-get install curl -y
COPY functionalPing.sh functionalPing.sh
COPY ping.sh ping.sh
COPY functions.sh functions.sh
ENTRYPOINT ["./functionalPing.sh"]
