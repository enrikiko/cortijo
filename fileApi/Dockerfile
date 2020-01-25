FROM ubuntu:19.04
RUN apt update
RUN apt-get update
RUN apt install -y python-pip
RUN pip install Flask
RUN mkdir /src/
COPY ./favicon.ico /src/favicon.ico
COPY ./init.py /src/init.py
COPY ./init.sh /src/init.sh
WORKDIR /src/
USER root
RUN chmod +X init.sh
#CMD python init.sh
ENTRYPOINT ["sh", "init.sh"]
