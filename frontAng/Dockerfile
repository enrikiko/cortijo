FROM ubuntu:18.04
RUN apt update
RUN apt-get update
RUN apt install apache2 -y
RUN mkdir angular
COPY ./dist/. angular/dist/.
COPY ./init.sh angular/init.sh
WORKDIR angular/.
RUN rm -r /var/www/html
RUN mv ./dist/frondAng /var/www/html
ENTRYPOINT ["sh", "init.sh"]
