FROM ubuntu:18.04
RUN apt-get update
RUN apt update
RUN apt install curl -y
RUN apt install apache2 -y
RUN apt-get update
RUN mkdir angular
COPY ./dist/. angular/dist/.
COPY ./init.sh angular/init.sh
WORKDIR angular/.
RUN rm -r /var/www/html
RUN mv ./dist/frondAng /var/www/html
ENTRYPOINT ["sh", "init.sh"]
