FROM ubuntu:16.04
RUN apt update
RUN apt install curl npm -y
WORKDIR /usr/src/app
COPY scs/package/. .
RUN npm install
COPY scs/. .
ENV mock_name=$NAME
ENV mock_port=$PORT
ENV local_ip=$IP
CMD sh init.sh
