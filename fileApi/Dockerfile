FROM ubuntu:19.04
RUN apt update
RUN apt-get update
RUN apt install -y python-pip
RUN pip install Flask
#RUN mkdir /src/
COPY ./favicon.ico favicon.ico
COPY ./init.py init.py
COPY ./init.sh init.sh
#WORKDIR /src/
#USER root
RUN chmod +X init.sh
#CMD python init.sh
ENTRYPOINT ["sh", "init.sh"]
