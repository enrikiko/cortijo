FROM ubuntu:19.04
RUN apt update
RUN apt-get update
RUN apt install -y python3-pip
RUN apt install -y python-pip
RUN pip install Flask
RUN mkdir /src/
COPY ./favicon.ico /src/favicon.ico
COPY ./init.sh /src/init.sh
COPY ./init.py /src/init.py
WORKDIR /src/
RUN chmod 777 init.sh
RUN ls
#ENTRYPOINT ["sh", "init.sh"]
