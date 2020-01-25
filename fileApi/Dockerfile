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
CMD python /src/init.sh
#ENTRYPOINT ["python", "/src/init.py"]
