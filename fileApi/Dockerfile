FROM ubuntu:19.04
RUN apt update
RUN apt-get update
RUN mkdir /src/
COPY ./favicon.ico /src/favicon.ico
COPY ./init.sh /src/init.sh
COPY ./init.py /src/init.py
WORKDIR /src/
RUN chmod 777 init.sh
ENTRYPOINT ["sh", "init.sh"]
