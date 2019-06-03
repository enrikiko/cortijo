FROM node:8
RUN apt update
RUN apt install curl -y
WORKDIR /usr/src/app
COPY scs/package/. .
RUN npm install
COPY scs/. .
ENV mock_name=$NAME
ENV mock_port=$PORT
ENTRYPOINT ["sh", "init.sh"]
