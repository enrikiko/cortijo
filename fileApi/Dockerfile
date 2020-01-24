FROM ubuntu:18.04
RUN apt update
RUN apt-get update
RUN mkdir /src/
COPY ./favicon.ico /src/
COPY ./init.py /src/
WORKDIR /src/
ENTRYPOINT ["python", "init.py"]
