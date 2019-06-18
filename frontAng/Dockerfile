FROM ubuntu:18.04
RUN apt-get update
RUN apt update
RUN apt install curl -y
RUN apt install apache2 -y
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get update
RUN apt-get install gcc g++ make -y
RUN apt-get install nodejs -y
RUN npm install -g @angular/cli
RUN mkdir angular
COPY ./. angular/.
WORKDIR angular/.
RUN npm install --save-dev @angular-devkit/build-angular
RUN ng build
RUN rm -r /var/www/html
RUN mv ./dist/frondAng /var/www/html
ENTRYPOINT ["sh", "init.sh"]
