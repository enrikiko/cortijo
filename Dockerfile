FROM enriqueramosmunoz/rolling:mongo
RUN mkdir /root/node
WORKDIR /root/node
RUN apt-get update
RUN apt update
COPY package/. .
RUN npm install
COPY . .
ENTRYPOINT ["sh", "init.sh"]
