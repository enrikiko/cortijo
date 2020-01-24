FROM ubuntu:18.04
RUN apt update
RUN apt-get update
RUN mkdir /src/
COPY ./favicon.ico /src/
COPY ./init.sh /src/
COPY ./init.py /src/
WORKDIR /src/
ENTRYPOINT ["sh", "init.sh"]
