FROM ubuntu:19.04
RUN apt update
RUN apt-get update
RUN apt install -y python-pip
RUN pip install Flask
RUN mkdir /files/
COPY ./favicon.ico favicon.ico
COPY ./init.py init.py
CMD python init.py
