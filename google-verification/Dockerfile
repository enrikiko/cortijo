FROM ubuntu:18.04
RUN apt update
RUN apt-get update
RUN apt install apache2 -y
RUN mkdir angular
COPY ./dist/. /var/www/html
COPY ./init.sh ./init.sh
ENTRYPOINT ["sh", "init.sh"]
