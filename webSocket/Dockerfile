FROM alpine
RUN apk add npm
RUN mkdir scr
WORKDIR scr
COPY package/. .
COPY . .
RUN npm install
CMD node server.js
