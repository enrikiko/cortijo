FROM ubuntu:18.04
RUN echo "Holi"
RUN apt update
RUN apt-get update
RUN mkdir /src/
COPY ./favicon.ico /src/favicon.ico
COPY ./init.sh /src/init.sh
COPY ./init.py /src/init.py
WORKDIR /src/
ENTRYPOINT ["sh", "init.sh"]
