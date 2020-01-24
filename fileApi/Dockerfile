FROM ubuntu:18.04
RUN apt update
RUN apt-get update
RUN apt install -y python3-pip
RUN mkdir /src/
COPY ./favicon.ico /src/
COPY ./init.py /src/
WORKDIR /src/
ENTRYPOINT ["sh", "init.sh"]
