FROM alpine
RUN apk add npm
RUN mkdir /root/scr
WORKDIR /root/scr
COPY package/. .
RUN npm install
COPY . .
#CMD node init.js
CMD sleep 1000000000
